import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId: string;
}

export const createRunUseCase = async (openAi: OpenAI, options: Options) => {
  const { threadId, assistantId } = options;

  const run = await openAi.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    // instructions: '' // Sobreescribe el asistente
  });

  return run;
};
