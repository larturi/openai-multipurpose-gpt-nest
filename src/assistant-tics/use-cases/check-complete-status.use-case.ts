import OpenAI from 'openai';

interface Options {
  threadId: string;
  runId: string;
}

export const checkRunCompleteStatusUseCase = async (openAi: OpenAI, options: Options) => {
  const { threadId, runId } = options;

  const runStatus = await openAi.beta.threads.runs.retrieve(threadId, runId);

  console.log(runStatus.status);

  if (runStatus.status === 'completed') {
    return runStatus.status;
  }

  // Esperar un segundo
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return await checkRunCompleteStatusUseCase(openAi, options);
};
