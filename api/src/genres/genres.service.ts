
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  // CREATE a genre
  async create(createGenreDto: CreateGenreDto) {
    try {
      return await this.prisma.genre.create({
        data: createGenreDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('This genre already exists.');
      }

      throw error;
    }
  }

  // READ all genres
  async findAll() {
    return this.prisma.genre.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // READ one genre
  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found.`);
    }

    return genre;
  }

  // UPDATE a genre
  async update(id: number, updateGenreDto: UpdateGenreDto) {
    await this.findOne(id);

    try {
      return await this.prisma.genre.update({
        where: { id },
        data: updateGenreDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('This genre name is already in use.');
      }

      throw error;
    }
  }

  // DELETE a genre
  async remove(id: number) {
    await this.findOne(id);

    const booksCount = await this.prisma.book.count({
      where: { genreId: id },
    });

    if (booksCount > 0) {
      throw new ConflictException(
        'Cannot delete this genre because books are assigned to it.',
      );
    }

    try {
      return await this.prisma.genre.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new ConflictException(
          'Cannot delete this genre because books are assigned to it.',
        );
      }

      if (
        error instanceof Error &&
        error.message.includes('Book_genreId_fkey')
      ) {
        throw new ConflictException(
          'Cannot delete this genre because books are assigned to it.',
        );
      }

      throw error;
    }
  }
}
