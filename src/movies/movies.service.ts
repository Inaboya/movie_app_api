import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { API_KEY } from 'src/constants';
import { sendPaginatedResponse } from 'src/utils';
import { MoviePaginatedDto, QueryParamsDto } from './dto/queryparams-dto';
import { MoviesInterface } from './interface/moviesinterface';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel('Movie')
    public readonly movieModel: Model<MoviesInterface>,
  ) {}
  async pushMovies(): Promise<{ message: string; data: any }> {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
      );

      const { results } = res.data;

      const movies = results.map((movie) => ({
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        popularity: movie.popularity,
        original_language: movie.original_language,
        original_title: movie.original_title,
        genre_ids: movie.genre_ids,
        backdrop_path: movie.backdrop_path,
        adult: movie.adult,
        video: movie.video,
        id: movie.id,
      }));

      const movieData = await this.movieModel.insertMany(movies);

      return {
        message: 'Movies added successfully',
        data: movieData,
      };
    } catch (error) {
      throw error;
    }
  }

  async getMovies(query: QueryParamsDto): Promise<MoviePaginatedDto> {
    const { page, limit, searchTerm } = query;
    const pageNumber = Number(page) || 1;
    const pageLimit = Number(limit) || 10;
    const skip = (pageNumber - 1) * pageLimit;

    let totalMovies = 0;
    let response = {} as MoviePaginatedDto;

    try {
      if (searchTerm) {
        const allMovies = await this.movieModel.find();
        const regexp = new RegExp(searchTerm, 'i');

        let filteredMovies = allMovies.filter((movie) => {
          const isMatch =
            regexp.test(movie.title) || regexp.test(movie.original_title);

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

      const mills = await this.movieModel.find().skip(skip).limit(pageLimit);

      totalMovies = await this.movieModel.countDocuments();

      const metaData = {
        data: mills,
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

  async getMovie(
    id: string,
  ): Promise<{ statusCode: number; data?: MoviesInterface; message: string }> {
    try {
      const movie = await this.movieModel.find({ _id: id });

      if (!movie) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Movie not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        data: movie as any,
        message: 'Get movie',
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteMovie(id: string) {
    try {
      const movie = await this.movieModel.find({ _id: id });
      if (!movie) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Movie not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return movie;
    } catch (error) {
      throw error;
    }
  }
}
