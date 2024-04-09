import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GptModule } from './gpt/gpt.module';
import { appConfig } from './config/app.config';
import { AssistantTicsModule } from './assistant-tics/assistant-tics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    AssistantTicsModule,
    GptModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
