import { Module } from '@nestjs/common';
import { AssistantTicsService } from './assistant-tics.service';
import { AssistantTicsController } from './assistant-tics.controller';

@Module({
  controllers: [AssistantTicsController],
  providers: [AssistantTicsService],
})
export class AssistantTicsModule {}
