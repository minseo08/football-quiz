import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    if (request.session && request.session.userId) {
      request.user = { id: request.session.userId, nickname: request.session.nickname };
      return true;
    }

    throw new UnauthorizedException('로그인이 필요한 서비스입니다.');
  }
}