import { Question, Topic } from '.prisma/client';

export enum AnswerType {
  SINGLE = 'single',
  MULTI = 'multi',
}

export type QuestionWithTopic = Question & { topic: Topic };
