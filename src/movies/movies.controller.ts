import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.service';
import { MoviePaginatedDto, QueryParamsDto } from './dto/queryparams-dto';
import { MoviesInterface } from './interface/moviesinterface';
import { MoviesService } from './movies.service';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Push Movies to Movies Collection' })
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    status: 201,
    description: 'Push movies',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Post()
  async pushMovies(): Promise<{ message: string; data: any }> {
    return await this.moviesService.pushMovies();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Movies from Movies Collection' })
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    status: 200,
    description: 'Get movies',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Get()
  async getMovies(
    @Query() queryParams: QueryParamsDto,
  ): Promise<MoviePaginatedDto> {
    return await this.moviesService.getMovies(queryParams);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one movie from Movies Collection' })
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    status: 200,
    description: 'Get one movie',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiParam({
    name: 'id',
    description: 'valid mongodb id',
    required: true,
  })
  @Get(':id')
  async getMovie(@Param('id') id: string): Promise<{
    statusCode: number;
    data?: MoviesInterface | any;
    message: string;
  }> {
    return await this.moviesService.getMovie(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete one movie from Movies Collection' })
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    status: 200,
    description: 'Delete one movie',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiParam({
    name: 'id',
    description: 'valid mongodb id',
    required: true,
  })
  @Delete(':id')
  async deleteMovie(@Param('id') id: string) {
    return await this.moviesService.deleteMovie(id);
  }
}
