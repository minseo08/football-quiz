import { Controller, Post, Body, Get } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';

@Controller('api/quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  async createQuiz(@Body() quizData: any) {
    return await this.quizzesService.create(quizData);
  }

  @Get()
  async findAll() {
    const quizzes = await this.quizzesService.findAll();
    return { success: true, quizzes };
  }
}