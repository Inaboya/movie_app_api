import mongoose from 'mongoose';

export interface FavoriteMovieInterface {
  movieId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  starRating: number;
  _id?: string;
}
