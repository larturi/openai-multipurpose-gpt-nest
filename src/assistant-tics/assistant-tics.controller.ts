import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AssistantTicsService } from './assistant-tics.service';
import { QuestionDto } from './dtos/question.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('assistant')
export class AssistantTicsController {
  constructor(private readonly assistantTicsService: AssistantTicsService) {}

  @Post('tics/create-thread')
  @UseGuards(JwtAuthGuard)
  async createThread() {
    return await this.assistantTicsService.createThread();
  }

  @Post('tics/user-question')
  @UseGuards(JwtAuthGuard)
  async userQuestion(@Body() questionDto: QuestionDto) {
    return await this.assistantTicsService.userQuestion(questionDto);
  }
}
