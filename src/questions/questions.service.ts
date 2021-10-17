import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { DEFAULT_ITEMS_PER_PAGE } from 'src/common/constants';
import { BaseQueryParamsDto } from 'src/common/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TopicsService } from 'src/topics/topics.service';
import {
  AnswerDto,
  CreateQuestionDto,
  GetManyQuestionsDto,
  GetQuestionDto,
  UpdateQuestionDto,
} from './questions.dto';
import { AnswerType, QuestionWithTopic } from './types';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly topicsService: TopicsService,
  ) {}

  async findMany(
    params: BaseQueryParamsDto = {},
  ): Promise<GetManyQuestionsDto> {
    const {
      offset: skip = 0,
      limit: take = DEFAULT_ITEMS_PER_PAGE,
      orderBy = {
        id: Prisma.SortOrder.asc,
      },
    } = params;

    const [total, items] = await Promise.all([
      this.prismaService.question.count(),
      this.prismaService.question.findMany({
        take,
        skip,
        orderBy,
        include: {
          topic: true,
        },
      }),
    ]);

    return {
      items: items.map(this.mapEntityToDto),
      total,
    };
  }

  async findById(id: number): Promise<GetQuestionDto> {
    const question = await this.prismaService.question.findUnique({
      where: { id },
      include: { topic: true },
      rejectOnNotFound: PrismaService.getNotFoundErrorGetter(),
    });
    return this.mapEntityToDto(question);
  }

  async create(questionDto: CreateQuestionDto): Promise<GetQuestionDto> {
    const { text, answerType, answers, topic } = questionDto;

    const topicId = await this.topicsService.upsertTopic(topic);
    const createdQuestion = await this.prismaService.question.create({
      data: {
        text,
        answerType,
        answers: answers as unknown as Prisma.JsonObject,
        topic: topicId ? { connect: { id: topicId } } : undefined,
      },
      include: { topic: true },
    });
    return this.mapEntityToDto(createdQuestion);
  }

  async update(
    id: number,
    questionDto: UpdateQuestionDto,
  ): Promise<GetQuestionDto> {
    const { text, answerType, answers, topic } = questionDto;
    const topicId = await this.topicsService.upsertTopic(topic);
    const updatedQuestion = await this.prismaService.question.update({
      where: { id },
      data: {
        text,
        answerType,
        topic: topicId ? { connect: { id: topicId } } : undefined,
        answers: answers as unknown as Prisma.JsonObject,
      },
      include: { topic: true },
    });
    return this.mapEntityToDto(updatedQuestion);
  }

  async delete(id: number): Promise<void> {
    await this.prismaService.question.delete({
      where: { id },
    });
  }

  mapEntityToDto(question: QuestionWithTopic): GetQuestionDto {
    const { id, text, topic, answers, answerType } = question;
    return {
      id,
      text,
      topic: topic ? topic.name : undefined,
      answerType: answerType as AnswerType,
      answers: answers as unknown as AnswerDto[],
    };
  }
}
