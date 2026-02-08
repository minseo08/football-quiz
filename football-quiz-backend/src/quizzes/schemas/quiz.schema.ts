import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Quiz extends Document {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  question: string;

  @Prop({ type: [String], required: true })
  imageUrls: string[];

  @Prop({ type: [String] })
  options: string[];

  @Prop({ type: [String], required: true })
  answer: string[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);