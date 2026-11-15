import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UpdateGenreDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name?: string;
}
