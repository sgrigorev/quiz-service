import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { DEFAULT_ITEMS_PER_PAGE } from 'src/common/constants';
import { BaseQueryParamsDto } from 'src/common/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateTopicDto,
  GetManyTopicsDto,
  GetTopicDto,
  UpdateTopicDto,
} from './topics.dto';

@Injectable()
export class TopicsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(params: BaseQueryParamsDto = {}): Promise<GetManyTopicsDto> {
    const {
      offset: skip = 0,
      limit: take = DEFAULT_ITEMS_PER_PAGE,
      orderBy = {
        id: Prisma.SortOrder.asc,
      },
    } = params;

    const [total, items] = await Promise.all([
      this.prismaService.topic.count(),
      this.prismaService.topic.findMany({
        take,
        skip,
        orderBy,
      }),
    ]);

    return {
      items,
      total,
    };
  }

  async findById(id: number): Promise<GetTopicDto> {
    return this.prismaService.topic.findUnique({
      where: { id },
      rejectOnNotFound: PrismaService.getNotFoundErrorGetter(),
    });
  }

  async create(topicDto: CreateTopicDto): Promise<GetTopicDto> {
    return this.prismaService.topic.create({
      data: {
        ...topicDto,
      },
    });
  }

  async update(id: number, topicDto: UpdateTopicDto): Promise<GetTopicDto> {
    return this.prismaService.topic.update({
      where: { id },
      data: { ...topicDto },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prismaService.topic.delete({
      where: { id },
    });
  }

  async upsertTopic(name: string): Promise<number | undefined> {
    if (name === undefined) {
      return;
    }
    const topic = await this.prismaService.topic.upsert({
      update: { name },
      create: { name },
      where: { name },
    });
    return topic.id;
  }
}
