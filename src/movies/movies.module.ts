import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JWT_SECRET } from 'src/constants';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MovieSchema } from './schema/movies.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Movie', schema: MovieSchema }]),
    JwtModule.register({
      secret: JWT_SECRET,
    }),
  ],
  exports: [MoviesService],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
