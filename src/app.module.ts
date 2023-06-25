import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { MONGO_URI, JWT_SECRET } from './constants';
import { AuthModule } from './auth/auth.module';
// import { FavoriteMoviesController } from './favorite-movies/favorite-movies.controller';
// import { FavoriteMoviesService } from './favorite-movies/favorite-movies.service';
import { FavoriteMoviesModule } from './favorite-movies/favorite-movies.module';

@Module({
  // imports: [UsersModule, MoviesModule],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(MONGO_URI),
    JwtModule.register({
      secret: JWT_SECRET,
    }),
    UsersModule,
    MoviesModule,
    AuthModule,
    FavoriteMoviesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
