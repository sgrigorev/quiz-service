import { Test, Topic } from '.prisma/client';
import { QuestionWithTopic } from 'src/questions/types';

export type TestWithQuestionsAndTopic = Test & { topic: Topic } & {
  questions: QuestionWithTopic[];
};
