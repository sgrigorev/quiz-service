import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DEFAULT_ITEMS_PER_PAGE } from 'src/common/constants';
import { BaseQueryParamsDto } from 'src/common/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestionsService } from 'src/questions/questions.service';
import { TopicsService } from 'src/topics/topics.service';
import {
  CreateTestDto,
  GetManyTestsDto,
  GetTestDto,
  UpdateTestDto,
} from './tests.dto';
import { TestWithQuestionsAndTopic } from './types';

@Injectable()
export class TestsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly topicsService: TopicsService,
    private readonly questionsService: QuestionsService,
  ) {}

  async findMany(params: BaseQueryParamsDto = {}): Promise<GetManyTestsDto> {
    const {
      offset: skip = 0,
      limit: take = DEFAULT_ITEMS_PER_PAGE,
      orderBy = {
        id: Prisma.SortOrder.asc,
      },
    } = params;

    const [total, rows] = await Promise.all([
      this.prismaService.test.count(),
      this.prismaService.test.findMany({
        take,
        skip,
        orderBy,
        include: {
          topic: true,
          questions: {
            include: {
              topic: true,
            },
          },
        },
      }),
    ]);

    const items = rows.map(
      ({ id, name, createdBy, createdAt, questions, topic }) => ({
        id,
        name,
        topic: topic ? topic.name : undefined,
        createdBy,
        createdAt,
        questionsCount: questions.length,
      }),
    );

    return {
      items,
      total,
    };
  }

  async findById(id: number): Promise<GetTestDto> {
    const test = await this.prismaService.test.findUnique({
      where: { id },
      include: {
        topic: true,
        questions: {
          include: {
            topic: true,
          },
        },
      },
      rejectOnNotFound: PrismaService.getNotFoundErrorGetter(),
    });

    return this.mapEntityToDto(test);
  }

  async create(testDto: CreateTestDto): Promise<GetTestDto> {
    const { name, createdBy, topic, questions } = testDto;
    const topicId = await this.topicsService.upsertTopic(topic);
    const test = await this.prismaService.test.create({
      data: {
        name,
        createdBy,
        topic: topicId ? { connect: { id: topicId } } : undefined,
        questions: {
          connect: questions.map((v) => ({ id: v })),
        },
      },
      include: {
        topic: true,
        questions: {
          include: {
            topic: true,
          },
        },
      },
    });

    return this.mapEntityToDto(test);
  }

  async update(id: number, testDto: UpdateTestDto): Promise<GetTestDto> {
    const { name, createdBy, topic, questions } = testDto;
    const topicId = await this.topicsService.upsertTopic(topic);
    const test = await this.prismaService.test.update({
      where: { id },
      data: {
        name,
        createdBy,
        topic: topicId ? { connect: { id: topicId } } : undefined,
        questions: {
          connect: questions.map((v) => ({ id: v })),
        },
      },
      include: {
        topic: true,
        questions: {
          include: {
            topic: true,
          },
        },
      },
    });

    return this.mapEntityToDto(test);
  }

  async delete(id: number): Promise<void> {
    await this.prismaService.test.delete({
      where: { id },
    });
  }

  private mapEntityToDto(test: TestWithQuestionsAndTopic): GetTestDto {
    const { id, name, createdBy, createdAt, questions, topic } = test;

    return {
      id,
      name,
      topic: topic !== undefined ? topic.name : undefined,
      createdBy,
      createdAt,
      questions: questions.map(this.questionsService.mapEntityToDto),
    };
  }
}
