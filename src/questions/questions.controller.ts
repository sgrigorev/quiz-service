import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BaseQueryParamsDto } from 'src/common/dto';
import {
  CreateQuestionDto,
  GetManyQuestionsDto,
  GetQuestionDto,
  UpdateQuestionDto,
} from './questions.dto';
import { QuestionsService } from './questions.service';

@Controller({
  path: 'questions',
})
@ApiTags('Questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список вопросов' })
  @ApiOkResponse({ type: GetManyQuestionsDto })
  async findMany(
    @Query() query?: BaseQueryParamsDto,
  ): Promise<GetManyQuestionsDto> {
    return this.questionsService.findMany(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получить вопрос по ID' })
  @ApiOkResponse({ type: GetQuestionDto })
  async findById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<GetQuestionDto> {
    return this.questionsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать вопрос' })
  @ApiCreatedResponse({ type: GetQuestionDto })
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<GetQuestionDto> {
    return this.questionsService.create(createQuestionDto);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Обновить вопрос' })
  @ApiOkResponse({ type: GetQuestionDto })
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<GetQuestionDto> {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить вопрос' })
  @ApiNoContentResponse()
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return this.questionsService.delete(id);
  }
}
