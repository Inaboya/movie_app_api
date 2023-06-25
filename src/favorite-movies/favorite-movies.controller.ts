import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.service';
import { QueryParamsDto } from 'src/movies/dto/queryparams-dto';
import { CustomRequest } from 'src/utils';
import { FavoriteMovieDTO, UpdateFavoriteMovieDTO } from './dto';
import { FavoriteMoviesService } from './favorite-movies.service';

@ApiTags('Movies List')
@Controller('favorite-movies')
export class FavoriteMoviesController {
  constructor(private readonly favoriteMoviesService: FavoriteMoviesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add Movies to Favorite Movies Collection' })
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    status: 201,
    description: 'Add movies',
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
  async addFavoriteMovies(
    @Req() req: CustomRequest,
    @Body() payload: FavoriteMovieDTO,
  ) {
    return await this.favoriteMoviesService.addFavoriteMovies(
      req.user.id,
      payload,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get movies from Favorite Movies Collection by star rating',
  })
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
  async getFavoriteMovies(
    @Query() queryParams: QueryParamsDto,
    @Req() req: CustomRequest,
  ) {
    return await this.favoriteMoviesService.getFavoriteMovies(
      queryParams,
      req.user.id,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update star rating of a movie' })
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    status: 200,
    description: 'Update star rating',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Patch(':id')
  async updateStarRating(
    @Param('id') id: string,
    @Req() req: CustomRequest,
    @Body() payload: UpdateFavoriteMovieDTO,
  ) {
    return await this.favoriteMoviesService.updateStarRating(
      id,
      req.user.id,
      payload,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a movie from Favorite Movies Collection' })
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    status: 200,
    description: 'Get a movie',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Get(':id')
  async getFavoriteMovie(@Param('id') id: string, @Req() req: CustomRequest) {
    return await this.favoriteMoviesService.getFavoriteMovie(id, req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a movie from Favorite Movies Collection' })
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    status: 200,
    description: 'Delete a movie',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Delete(':id')
  async deleteFavoriteMovie(
    @Param('id') id: string,
    @Req() req: CustomRequest,
  ) {
    return await this.favoriteMoviesService.deleteFavoriteMovie(
      id,
      req.user.id,
    );
  }
}
