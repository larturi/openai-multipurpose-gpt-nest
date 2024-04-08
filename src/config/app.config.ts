import { registerAs } from '@nestjs/config';
import { EnvironmentVariables } from './interfaces/environment.interface';

export const appConfig = registerAs('app', (): EnvironmentVariables['app'] => {
  const config = {
    port: process.env.PORT ?? '3000',
    serverUrl: process.env.SERVER_URL as string,
    openAIApiKey: process.env.OPENAI_API_KEY as string,
  };

  validateConfig(config);

  return config;
});

export function validateConfig(config: any): void {
  const missingVars = [];

  if (!config.serverUrl) missingVars.push('SERVER_URL');
  if (!config.openAIApiKey) missingVars.push('OPENAI_API_KEY');

  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }
}
