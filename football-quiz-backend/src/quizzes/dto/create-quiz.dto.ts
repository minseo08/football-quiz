import { IsString, IsArray, IsEnum, IsOptional, ArrayMinSize } from 'class-validator';

export class CreateQuizDto {
  @IsEnum(['logo', 'player', 'stadium'], { message: '유효한 퀴즈 타입이 아닙니다.' })
  type: string;

  @IsString()
  question: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  answer: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  imageUrls: string[];
}