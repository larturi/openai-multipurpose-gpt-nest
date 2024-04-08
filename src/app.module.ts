import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GptModule } from './gpt/gpt.module';
import { appConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    GptModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
