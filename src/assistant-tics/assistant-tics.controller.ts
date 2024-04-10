import { Body, Controller, Post } from '@nestjs/common';
import { AssistantTicsService } from './assistant-tics.service';
import { QuestionDto } from './dtos/question.dto';

@Controller('assistant')
export class AssistantTicsController {
  constructor(private readonly assistantTicsService: AssistantTicsService) {}

  @Post('tics/create-thread')
  async createThread() {
    return await this.assistantTicsService.createThread();
  }

  @Post('tics/user-question')
  async userQuestion(@Body() questionDto: QuestionDto) {
    return await this.assistantTicsService.userQuestion(questionDto);
  }
}
