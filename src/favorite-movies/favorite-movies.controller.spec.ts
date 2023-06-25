import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteMoviesController } from './favorite-movies.controller';

describe('FavoriteMoviesController', () => {
  let controller: FavoriteMoviesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteMoviesController],
    }).compile();

    controller = module.get<FavoriteMoviesController>(FavoriteMoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
