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
  CreateTopicDto,
  GetManyTopicsDto,
  GetTopicDto,
  UpdateTopicDto,
} from './topics.dto';
import { TopicsService } from './topics.service';

@Controller({
  path: 'topics',
})
@ApiTags('Topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список топиков' })
  @ApiOkResponse({ type: GetManyTopicsDto })
  async findMany(
    @Query() query?: BaseQueryParamsDto,
  ): Promise<GetManyTopicsDto> {
    return this.topicsService.findMany(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получить топик по ID' })
  @ApiOkResponse({ type: GetTopicDto })
  async findById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<GetTopicDto> {
    return this.topicsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать топик' })
  @ApiCreatedResponse({ type: GetTopicDto })
  async create(@Body() createTopicDto: CreateTopicDto): Promise<GetTopicDto> {
    return this.topicsService.create(createTopicDto);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Обновить топик' })
  @ApiOkResponse({ type: GetTopicDto })
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateTopicDto: UpdateTopicDto,
  ): Promise<GetTopicDto> {
    return this.topicsService.update(id, updateTopicDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить топик' })
  @ApiNoContentResponse()
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return this.topicsService.delete(id);
  }
}
