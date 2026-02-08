import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from './schemas/quiz.schema';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<Quiz>) {}

  // 모든 퀴즈 가져오기
  async findAll(): Promise<Quiz[]> {
    return this.quizModel.find().exec();
  }

  // 새로운 퀴즈 추가
  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const newQuiz = new this.quizModel(createQuizDto);
    return newQuiz.save();
  }

  // 특정 타입의 랜덤 퀴즈 가져오기
  async getRandomQuizzes(type: string, limit: number = 10): Promise<Quiz[]> {
    return this.quizModel.aggregate([
      { $match: { type } },
      { $sample: { size: limit } }
    ]).exec();
  }
}