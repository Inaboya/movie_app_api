import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/users.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: JWT_SECRET,
    }),
  ],
  exports: [UsersService],
  providers: [UsersService, JwtService],
  controllers: [UsersController],
})
export class UsersModule {}
