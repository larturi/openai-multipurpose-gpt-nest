import OpenAI from 'openai';

interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, lang } = options;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
        Ponte en el rol de un traductor.

        Traduce el siguiente texto al idioma ${lang}: ${prompt}.

        Ejemplo de salida JSON:
        {
          "text": "Es un placer conocerte, ¿puedes indicarme dónde encuentro la estación de bus más cercana?",
          "translation": "Es un placer conocerte, ¿puedes indicarme dónde encuentro la estación de bus más cercana?",
          "originalLang": "Español",
          "translatedLang": "Inglés"
        }
        `,
      },
    ],
    model: 'gpt-3.5-turbo-1106',
    temperature: 0.1,
    response_format: {
      type: 'json_object',
    },
  });

  const jsonResponse = JSON.parse(completion.choices[0].message.content);

  return jsonResponse;
};
