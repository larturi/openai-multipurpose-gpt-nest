import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GptModule } from './gpt/gpt.module';
import { appConfig } from './config/app.config';
import { AssistantTicsModule } from './assistant-tics/assistant-tics.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    AssistantTicsModule,
    GptModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
