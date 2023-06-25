import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FavoriteMovieDTO {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  starRating: number;

  @ApiProperty()
  @Type(() => String)
  @IsNotEmpty()
  movieId: string;
}

export class UpdateFavoriteMovieDTO {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  starRating: number;
}
