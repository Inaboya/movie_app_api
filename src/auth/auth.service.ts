import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/constants';

@Injectable()
export class AuthGuard {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];
      let authStatus: boolean;

      if (!token) {
        authStatus = false;
        return authStatus;
      }

      const user = await this.jwtService.verify(token, {
        secret: JWT_SECRET,
      });

      if (!user) {
        authStatus = false;
        return authStatus;
      }

      request.user = user;
      authStatus = true;
      return authStatus;
    } catch (error) {
      return false;
    }
  }
}
