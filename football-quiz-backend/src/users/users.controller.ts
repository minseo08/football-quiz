import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    try {
      const user = await this.usersService.findById(req.user.id);
      return { success: true, user };
    } catch (error) {
      return { success: false, message: '유저 정보를 찾을 수 없습니다.' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-stats')
  async updateStats(@Req() req: any, @Body() body: { solved: number; correct: number }) {
    try {
      console.log('통계 업데이트 요청 유저:', req.user.id);
      console.log('데이터:', body);

      const userId = req.user.id;
      const updatedUser = await this.usersService.updateStats(userId, body.solved, body.correct);

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('서버 통계 업데이트 중 에러:', error);
      return { success: false, message: '업데이트 실패' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-nickname')
  async updateNickname(@Req() req: any, @Body() body: { nickname: string }) {
    const userId = req.user.id || req.user._id;
    const updatedUser = await this.usersService.updateNickname(userId, body.nickname);
    return { success: true, user: updatedUser };
  }
}