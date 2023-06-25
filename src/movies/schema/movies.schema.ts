import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Movie {
  @Prop({ type: Boolean })
  adult: boolean;

  @Prop({ type: String })
  backdrop_path: string;

  @Prop({ type: Array })
  genre_ids: any[];

  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  original_language: string;

  @Prop({ type: String })
  original_title: string;

  @Prop({ type: String })
  overview: string;

  @Prop({ type: Number })
  popularity: number;

  @Prop({ type: String })
  poster_path: string;

  @Prop({ type: String })
  release_date: string;

  @Prop({ type: String })
  title: string;

  @Prop({ type: Boolean })
  video: boolean;

  @Prop({ type: Number })
  vote_average: number;

  @Prop({ type: Number })
  vote_count: number;
}

export type MovieDocument = Movie & mongoose.Document;

export const MovieSchema = SchemaFactory.createForClass(Movie);
