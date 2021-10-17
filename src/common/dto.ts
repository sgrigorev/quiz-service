import { Prisma } from '.prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { DEFAULT_ITEMS_PER_PAGE } from './constants';
import { OrderBy } from './types';

export class BaseQueryParamsDto {
  @ApiPropertyOptional({
    description: 'Максимальное количество записей в ответе',
    type: 'integer',
    default: DEFAULT_ITEMS_PER_PAGE,
    minimum: 1,
  })
  @Min(1)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly limit?: number;

  @ApiProperty({
    description: 'Сколько записей нужно пропустить',
    default: 0,
    type: 'integer',
    minimum: 0,
  })
  @Min(0)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly offset?: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Поле и направление сортировки',
    example: 'name:asc',
  })
  @Transform(({ value }) => transformOrderBy(value))
  readonly orderBy?: OrderBy[];
}

function transformOrderBy(
  value: string | string[],
): Record<string, Prisma.SortOrder>[] {
  if (Array.isArray(value)) {
    return value.map((v) => mapStringToOrderBy(v));
  } else {
    return [mapStringToOrderBy(value)];
  }
}

function mapStringToOrderBy(value: string): Record<string, Prisma.SortOrder> {
  const [column, order = Prisma.SortOrder.asc] = value.split(':');
  return {
    [column as string]: order as Prisma.SortOrder,
  };
}
