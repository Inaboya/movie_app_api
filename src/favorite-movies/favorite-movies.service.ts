import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MoviePaginatedDto,
  QueryParamsDto,
} from 'src/movies/dto/queryparams-dto';
import { MoviesService } from 'src/movies/movies.service';
import { UsersService } from 'src/users/users.service';
import { sendPaginatedResponse } from 'src/utils';
import { FavoriteMovieDTO, UpdateFavoriteMovieDTO } from './dto';
import { FavoriteMovieInterface } from './interface';

@Injectable()
export class FavoriteMoviesService {
  constructor(
    @InjectModel('FavoriteMovie')
    public readonly favoriteMovieModel: Model<FavoriteMovieInterface>,
    private readonly usersService: UsersService,
    private readonly moviesService: MoviesService,
  ) {}

  async addFavoriteMovies(userId: string, payload: FavoriteMovieDTO) {
    if (payload.starRating > 5 || payload.starRating < 0) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Star rating must be between 0 and 5',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const user = await this.usersService.findUserById(userId);

      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const movie = await this.moviesService.getMovie(payload.movieId);

      if (!movie) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Movie not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const checkMovies = await this.favoriteMovieModel.findOne({
        movieId: payload.movieId,
        userId,
      });

      if (checkMovies) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Movie already added to favorites',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const favoriteMovie = await this.favoriteMovieModel.create({
        movieId: payload.movieId,
        userId,
        starRating: payload.starRating ? payload.starRating : 0,
      });

      return {
        message: 'Movie added successfully',
        favoriteMovie,
      };
    } catch (error) {
      throw error;
    }
  }

  async getFavoriteMovies(query: QueryParamsDto, userId: string) {
    const { page, limit, searchTerm } = query;

    const pageNumber = Number(page) || 1;
    const pageLimit = Number(limit) || 10;
    const skip = (pageNumber - 1) * pageLimit;

    let totalMovies = 0;
    let response = {} as MoviePaginatedDto;

    try {
      if (searchTerm) {
        const allMovies = await this.favoriteMovieModel.find({ userId });
        const regexp = new RegExp(searchTerm, 'i');

        let filteredMovies = allMovies.filter((movie) => {
          const isMatch =
            //@ts-ignore
            regexp.test(movie.movieId.title) ||
            //@ts-ignore

            regexp.test(movie.movieId.original_title);

          return isMatch;
        });

        totalMovies = filteredMovies.length;

        filteredMovies = filteredMovies.slice(skip).slice(0, pageLimit);

        const metaData = {
          data: filteredMovies,
          skip,
          limit: pageLimit,
          count: totalMovies,
          page: pageNumber,
        };

        response = sendPaginatedResponse(metaData);

        return response;
      }

      const movies = await this.favoriteMovieModel
        .find({ userId })
        .sort({ starRating: 1 })
        .skip(skip)
        .limit(pageLimit);

      totalMovies = await this.favoriteMovieModel.countDocuments({ userId });

      const metaData = {
        data: movies,
        skip,
        limit: pageLimit,
        count: totalMovies,
        page: pageNumber,
      };

      response = sendPaginatedResponse(metaData);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateStarRating(
    id: string,
    userId: string,
    payload: UpdateFavoriteMovieDTO,
  ) {
    const { starRating } = payload;

    if (starRating > 5 || starRating < 0) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Star rating must be between 0 and 5',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const user = await this.usersService.findUserById(userId);

      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const movie = await this.moviesService.getMovie(id);

      if (!movie) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Movie not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedFavoriteMovie =
        await this.favoriteMovieModel.findOneAndUpdate(
          { movieId: id, userId },
          { starRating },
          { new: true },
        );

      if (!updatedFavoriteMovie) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Movie not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Movie updated successfully',
        updatedFavoriteMovie,
      };
    } catch (error) {
      throw error;
    }
  }

  async getFavoriteMovie(id: string, userId: string) {
    try {
      const user = await this.usersService.findUserById(userId);

      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const movie = await this.moviesService.getMovie(id);

      if (!movie) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Movie not found in movies collection',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const favoriteMovie = await this.favoriteMovieModel.findOne({
        movieId: id,
        userId,
      });

      if (!favoriteMovie) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Movie not found in favorite movies collection',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Movie found',
        favoriteMovie,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteFavoriteMovie(id: string, userId: string) {
    try {
      const user = await this.usersService.findUserById(userId);

      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const movie = await this.moviesService.getMovie(id);

      if (!movie) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Movie not found in movies collection',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const favoriteMovie = await this.favoriteMovieModel.findOne({
        movieId: id,
        userId,
      });

      if (!favoriteMovie) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Movie not found in favorite movies collection',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      await this.favoriteMovieModel.findOneAndDelete({
        movieId: id,
        userId,
      });

      return {
        message: 'Movie deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
