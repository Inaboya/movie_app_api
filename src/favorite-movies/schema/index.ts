import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class FavoriteMovie {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' })
  movieId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: Number })
  starRating: number;
}

export type FavoriteMovieDocument = FavoriteMovie & mongoose.Document;

export const FavoriteMovieSchema = SchemaFactory.createForClass(FavoriteMovie);

FavoriteMovieSchema.index({ movieId: 1, userId: 1 }, { unique: true });

FavoriteMovieSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'movieId',
    select: [
      'title',
      'poster_path',
      'overview',
      'release_date',
      'vote_average',
    ],
  });
  next();
});

FavoriteMovieSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: ['name', 'email', 'avatar'],
  });
  next();
});
