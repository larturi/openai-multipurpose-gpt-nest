import { Injectable } from '@nestjs/common';

import OpenAI from 'openai';
import {
  checkRunCompleteStatusUseCase,
  createMessageUseCase,
  createRunUseCase,
  createThreadUseCase,
  getMessageListByThreadUseCase,
} from './use-cases';
import { QuestionDto } from './dtos/question.dto';

@Injectable()
export class AssistantTicsService {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });

  async createThread() {
    return createThreadUseCase(this.openai);
  }

  async userQuestion(questionDto: QuestionDto) {
    const { threadId, question, assistantId } = questionDto;
    const message = await createMessageUseCase(this.openai, { threadId, question });

    const run = await createRunUseCase(this.openai, {
      threadId,
      assistantId,
    });

    await checkRunCompleteStatusUseCase(this.openai, { runId: run.id, threadId: threadId });

    const messages = await getMessageListByThreadUseCase(this.openai, { threadId });

    return messages.reverse();
  }
}
