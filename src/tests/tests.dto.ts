import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { GetQuestionDto } from 'src/questions/questions.dto';

export class GetTestDto {
  @ApiProperty({ description: 'ID теста' })
  readonly id!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Имя теста' })
  readonly name!: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({ description: 'Топик теста' })
  readonly topic?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Кем создан' })
  readonly createdBy!: string;

  @Type(() => Date)
  @ApiProperty({ description: 'Дата создания' })
  readonly createdAt!: Date;

  @IsArray()
  @ApiProperty({ description: 'Список вопросов' })
  readonly questions!: GetQuestionDto[];
}

export class GetTestPartialDto extends OmitType(GetTestDto, ['questions']) {
  @ApiProperty({ description: 'Количество вопросов в тесте' })
  readonly questionsCount!: number;
}

export class GetManyTestsDto {
  @ApiProperty({ description: 'Массив тестов', type: [GetTestPartialDto] })
  readonly items!: GetTestPartialDto[];

  @ApiProperty({ description: 'Общее количество тестов' })
  readonly total!: number;
}

export class CreateTestDto extends OmitType(GetTestDto, [
  'id',
  'createdAt',
  'questions',
]) {
  @IsArray()
  @ApiProperty({ description: 'Список вопросов', example: [1, 2] })
  readonly questions!: number[];
}

export class UpdateTestDto extends CreateTestDto {}
