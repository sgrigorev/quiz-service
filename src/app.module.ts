import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionsModule } from './questions/questions.module';
import { TestsModule } from './tests/tests.module';
import { TopicsModule } from './topics/topics.module';

@Module({
  imports: [PrismaModule, TestsModule, QuestionsModule, TopicsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
