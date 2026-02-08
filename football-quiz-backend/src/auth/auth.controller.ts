import { Controller, Post, Body, Session, HttpException, HttpStatus, Get } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: any) {
    const { username, password, nickname } = body;

    const existingUser = await this.usersService.findOneByUsername(username);
    if (existingUser) throw new HttpException('이미 존재하는 아이디입니다.', HttpStatus.BAD_REQUEST);

    const existingNickname = await this.usersService.findOneByNickname(nickname);
    if (existingNickname) throw new HttpException('이미 사용 중인 닉네임입니다.', HttpStatus.BAD_REQUEST);

    await this.usersService.create({ username, password, nickname });
    return { success: true, message: '회원가입이 완료되었습니다.' };
  }

  @Post('login')
  async login(@Body() body: any, @Session() session: Record<string, any>) {
    const { username, password } = body;

    const user = await this.usersService.findOneByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException('아이디 또는 비밀번호가 잘못되었습니다.', HttpStatus.UNAUTHORIZED);
    }

    if (user.isOnline && session.userId !== user._id.toString()) {
      throw new HttpException('이미 로그인 중인 계정입니다.', HttpStatus.FORBIDDEN);
    }

    session.userId = user._id.toString();
    session.nickname = user.nickname;

    await this.usersService.updateOnlineStatus(user._id.toString(), true);

    return {
      success: true,
      user: { username: user.username, nickname: user.nickname }
    };
  }

  @Post('logout')
  async logout(@Session() session: Record<string, any>) {
    if (session.userId) {
      await this.usersService.updateOnlineStatus(session.userId, false);
    }
    session.destroy((err) => {
      if (err) throw new HttpException('로그아웃 실패', HttpStatus.INTERNAL_SERVER_ERROR);
    });
    return { success: true };
  }

  @Get('check')
  async check(@Session() session: Record<string, any>) {
    if (!session.userId) return { authenticated: false };
    
    const user = await this.usersService.findById(session.userId);
    if (!user) return { authenticated: false };

    return {
      authenticated: true,
      user: { username: user.username, nickname: user.nickname }
    };
  }
}