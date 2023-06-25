import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { MoviesInterface } from '../interface/moviesinterface';

export class QueryParamsDto {
  @IsOptional()
  @Type(() => String)
  @IsString()
  page?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  limit?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  message?: string;
}

export class MoviePaginatedDto {
  count?: number;

  currentPage?: number;

  previousPage?: boolean;

  nextPage?: boolean;

  data?: MoviesInterface[];

  message?: string;
}
