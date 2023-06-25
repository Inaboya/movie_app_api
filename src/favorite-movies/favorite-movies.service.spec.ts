import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteMoviesService } from './favorite-movies.service';

describe('FavoriteMoviesService', () => {
  let service: FavoriteMoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoriteMoviesService],
    }).compile();

    service = module.get<FavoriteMoviesService>(FavoriteMoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
