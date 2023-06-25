import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { MoviesController } from './movies/movies.controller';
import { MoviesService } from './movies/movies.service';
import { MoviesModule } from './movies/movies.module';
import { FavoriteMoviesController } from './favorite-movies/favorite-movies.controller';
import { FavoriteMoviesService } from './favorite-movies/favorite-movies.service';
import { FavoriteMoviesModule } from './favorite-movies/favorite-movies.module';

@Module({
  imports: [UsersModule, MoviesModule, FavoriteMoviesModule],
  controllers: [AppController, UsersController, MoviesController, FavoriteMoviesController],
  providers: [AppService, UsersService, MoviesService, FavoriteMoviesService],
})
export class AppModule {}
