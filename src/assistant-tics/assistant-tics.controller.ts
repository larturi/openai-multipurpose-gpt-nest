import { Body, Controller, Post } from '@nestjs/common';
import { AssistantTicsService } from './assistant-tics.service';
import { QuestionDto } from './dtos/question.dto';

@Controller('assistant-tics')
export class AssistantTicsController {
  constructor(private readonly assistantTicsService: AssistantTicsService) {}

  @Post('create-thread')
  async createThread() {
    return await this.assistantTicsService.createThread();
  }

  @Post('user-question')
  async userQuestion(@Body() questionDto: QuestionDto) {
    return await this.assistantTicsService.userQuestion(questionDto);
  }
}
