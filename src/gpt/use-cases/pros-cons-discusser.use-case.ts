import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDiscusserUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
        Se te dara una pregunta y tu tarea es dar una respuesta con pros y contras.
        La respuesta debe ser en formato markdown.
        Los pros y contras deben estar en una lista
        `,
      },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-3.5-turbo',
    temperature: 0.8,
    max_tokens: 500,
  });

  return response.choices[0].message;
};
