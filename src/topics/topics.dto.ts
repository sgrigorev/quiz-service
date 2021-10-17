import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetTopicDto {
  @ApiProperty({ description: 'ID топика' })
  readonly id!: number;

  @ApiProperty({ description: 'Имя' })
  readonly name!: string;
}

export class GetManyTopicsDto {
  @ApiProperty({ description: 'Массив топиков', type: [GetTopicDto] })
  readonly items!: GetTopicDto[];

  @ApiProperty({ description: 'Общее количество топиков' })
  readonly total!: number;
}

export class CreateTopicDto extends OmitType(GetTopicDto, ['id']) {
  @IsNotEmpty()
  readonly name!: string;
}

export class UpdateTopicDto extends CreateTopicDto {}
