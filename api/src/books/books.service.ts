import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  // CREATE a book
  async create(createBookDto: CreateBookDto) {
    const genre = await this.prisma.genre.findUnique({
      where: { id: createBookDto.genreId },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found.');
    }

    try {
      return await this.prisma.book.create({
        data: createBookDto,
        include: { genre: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('This ISBN already exists.');
      }
      throw error;
    }
  }

  // READ all books with filtering, search and pagination
  async findAll(options: {
    genreId?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { genreId, search } = options;
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;

    if (!Number.isInteger(page) || page < 1) {
      throw new BadRequestException('Page must be a positive integer.');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100.');
    }

    const where: Prisma.BookWhereInput = {};

    if (genreId !== undefined) {
      where.genreId = genreId;
    }

    if (search?.trim()) {
      where.OR = [
        {
          title: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
        {
          author: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        include: { genre: true },
        orderBy: { title: 'asc' },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // READ one book
  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found.`);
    }

    return book;
  }

  // UPDATE a book
  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);

    if (updateBookDto.genreId !== undefined) {
      const genre = await this.prisma.genre.findUnique({
        where: { id: updateBookDto.genreId },
      });

      if (!genre) {
        throw new NotFoundException('Genre not found.');
      }
    }

    try {
      return await this.prisma.book.update({
        where: { id },
        data: updateBookDto,
        include: { genre: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('This ISBN already exists.');
      }
      throw error;
    }
  }

  // DELETE a book
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.book.delete({
      where: { id },
    });
  }
}