import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { AnswerType } from './types';

export class AnswerDto {
  @IsUUID(4)
  @ApiProperty({ description: 'ID ответа', format: 'uuid' })
  readonly id!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Текст варианта ответа' })
  readonly text!: string;

  @IsBoolean()
  @ApiProperty({ description: 'Является ли ответ правильным' })
  readonly isCorrect!: boolean;
}

export class GetQuestionDto {
  @ApiProperty({ description: 'ID вопроса' })
  readonly id!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Тест вопроса' })
  readonly text!: string;

  @ApiPropertyOptional({ description: 'Топик' })
  readonly topic?: string;

  @IsIn(Object.values(AnswerType))
  @ApiProperty({
    description: 'Тип ответа (есть один правильный ответ или несколько)',
    enum: Object.values(AnswerType),
  })
  readonly answerType!: AnswerType;

  @IsArray()
  @ApiProperty({ description: 'Список вопросов', type: [AnswerDto] })
  readonly answers!: AnswerDto[];
}

export class GetManyQuestionsDto {
  @ApiProperty({ description: 'Массив вопросов', type: [GetQuestionDto] })
  readonly items!: GetQuestionDto[];

  @ApiProperty({ description: 'Общее количество вопросов' })
  readonly total!: number;
}

export class CreateQuestionDto extends OmitType(GetQuestionDto, ['id']) {}

export class UpdateQuestionDto extends CreateQuestionDto {}
