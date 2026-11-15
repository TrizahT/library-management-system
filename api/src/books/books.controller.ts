import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';

import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Role } from '@prisma/client';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // POST /books

  @Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.LIBRARIAN)
create(@Body() createBookDto: CreateBookDto) {
  return this.booksService.create(createBookDto);
}
  // GET /books?genreId=1&search=clean&page=1&limit=10
  @Get()
  findAll(
    @Query('genreId') genreId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const parsePositiveInteger = (
      value: string | undefined,
      field: string,
    ): number | undefined => {
      if (value === undefined || value === '') {
        return undefined;
      }

      const parsed = Number(value);

      if (!Number.isInteger(parsed) || parsed < 1) {
        throw new BadRequestException(
          `${field} must be a positive integer.`,
        );
      }

      return parsed;
    };

    return this.booksService.findAll({
      genreId: parsePositiveInteger(genreId, 'genreId'),
      search,
      page: parsePositiveInteger(page, 'page'),
      limit: parsePositiveInteger(limit, 'limit'),
    });
  }

  // GET /books/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  // PATCH /books/:id
 @Patch(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.LIBRARIAN)
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateBookDto: UpdateBookDto,
) {
  return this.booksService.update(id, updateBookDto);
}

  // DELETE /books/:id
  @Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.LIBRARIAN)
remove(@Param('id', ParseIntPipe) id: number) {
  return this.booksService.remove(id);
}
}
