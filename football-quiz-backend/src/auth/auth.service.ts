import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(username: string, pass: string) {
    const user = await this.usersService.findOneByUsername(username);

    if (user && user.password === pass) {
      if (user.isOnline) {
        throw new UnauthorizedException('이미 다른 기기에서 로그인 중입니다.');
      }

      await this.usersService.updateOnlineStatus(user._id.toString(), true);
      
      return { success: true, user };
    }
    throw new UnauthorizedException('아이디 또는 비밀번호가 틀립니다.');
  }
}