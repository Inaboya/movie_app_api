import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JWT_SECRET } from 'src/constants';
import { MoviesModule } from 'src/movies/movies.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { FavoriteMoviesController } from './favorite-movies.controller';
import { FavoriteMoviesService } from './favorite-movies.service';
import { FavoriteMovieSchema } from './schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'FavoriteMovie', schema: FavoriteMovieSchema },
    ]),
    JwtModule.register({
      secret: JWT_SECRET,
    }),
    UsersModule,
    MoviesModule,
  ],
  controllers: [FavoriteMoviesController],
  providers: [FavoriteMoviesService],
  exports: [FavoriteMoviesService],
})
export class FavoriteMoviesModule {}
