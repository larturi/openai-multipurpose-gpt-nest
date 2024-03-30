import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
        Te seran proveidos diferentes textos en español con posibles errores ortográficos y gramaticáles.
        Debes responder en formato JSON.
        Tu tarea es corregirlos y retornar información y soluciones. 
        Si no hay errores, debes retornar un mensaje de felicitación.
        Siempre debes brindar en la respuesta un porcentaje de aciertos.

        Ejemplo de salida JSON:
        {
          userScore: number,
          errors: string[] // ['error -> solucion'],
          message: string // Utiliza emojis y texto para felicitar y motivar al usuario
        }
        `,
      },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-3.5-turbo-1106',
    temperature: 0.3,
    max_tokens: 150,
    response_format: {
      type: 'json_object',
    },
  });

  const jsonResponse = JSON.parse(completion.choices[0].message.content);

  return jsonResponse;
};
