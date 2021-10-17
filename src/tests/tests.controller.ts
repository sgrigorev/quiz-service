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
  CreateTestDto,
  GetManyTestsDto,
  GetTestDto,
  UpdateTestDto,
} from './tests.dto';
import { TestsService } from './tests.service';

@Controller({
  path: 'tests',
})
@ApiTags('Tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список тестов' })
  @ApiOkResponse({ type: GetManyTestsDto })
  async findMany(
    @Query() query?: BaseQueryParamsDto,
  ): Promise<GetManyTestsDto> {
    return this.testsService.findMany(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получить тест по ID' })
  @ApiOkResponse({ type: GetTestDto })
  async findById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<GetTestDto> {
    return this.testsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать тест' })
  @ApiCreatedResponse({ type: GetTestDto })
  async create(@Body() createQuestionDto: CreateTestDto): Promise<GetTestDto> {
    return this.testsService.create(createQuestionDto);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Обновить тест' })
  @ApiOkResponse({ type: GetTestDto })
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateQuestionDto: UpdateTestDto,
  ): Promise<GetTestDto> {
    return this.testsService.update(id, updateQuestionDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить тест' })
  @ApiNoContentResponse()
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return this.testsService.delete(id);
  }
}
