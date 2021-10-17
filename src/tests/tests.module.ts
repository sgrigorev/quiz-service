import { Module } from '@nestjs/common';
import { QuestionsModule } from 'src/questions/questions.module';
import { TopicsModule } from 'src/topics/topics.module';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';

@Module({
  imports: [QuestionsModule, TopicsModule],
  controllers: [TestsController],
  providers: [TestsService],
})
export class TestsModule {}
