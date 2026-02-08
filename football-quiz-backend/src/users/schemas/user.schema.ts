import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop({ default: 0 })
  totalSolved: number;

  @Prop({ default: 0 })
  totalCorrect: number;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop({ default: null })
  currentSocketId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);