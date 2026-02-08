import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit{
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: any): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async onModuleInit() {
    await this.userModel.updateMany({}, { isOnline: false });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findOneByNickname(nickname: string): Promise<User | null> {
    return this.userModel.findOne({ nickname }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async updateOnlineStatus(userId: string, status: boolean) {
    return await this.userModel.findByIdAndUpdate(userId, { isOnline: status });
  }

  async updateNickname(userId: string, newNickname: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { nickname: newNickname },
      { new: true }
    );
  }

  async updateStats(userId: string, solvedCount: number, correctCount: number) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        $inc: {
          totalSolved: solvedCount,
          totalCorrect: correctCount
        }
      },
      { new: true }
    );
  }
}