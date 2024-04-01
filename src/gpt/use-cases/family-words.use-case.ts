import OpenAI from 'openai';

interface Options {
  word: string;
}

export const familyWordsUseCase = async (openai: OpenAI, options: Options) => {
  const { word } = options;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
        Ponte en el rol de un profesor de ingles.

        Te doy una palabra en ingles y debes proveer un json con la familia de palabras en ingles y su traduccion a español.

        Si la palabra no tiene adverb retornar null en dicha property.
        Si la palabra no tiene adjective retornar null en dicha property.
        Si la palabra no tiene noun retornar null en dicha property.
        Si la palabra no tiene verb retornar null en dicha property.

        Evita pasar a plural la palabra.

        Evita repetir palabras.

        En "explanation" debes dar la traduccion, el tipo (adverbio | sustantivo | verbo | adjetivo) y algun tip importante para la palabra en cuestion.

        Te dejo ejemplos de referencia pero no los uses.

        Ejemplo de salida JSON:
        {
          "word": "apple",
          "verb": null,
          "noun": "apples -> manzanas",
          "adjective": "null",
          "adverb": null,
          "explanation": {
              "translation": ?,
              "type": ?,
              "tip": ?
          }
        }

        Otro ejemplo de salida JSON:
        {
          "word": "run",
          "verb": run -> correr,
          "noun": "runner -> corredor",
          "adjective": "running -> running shoes",
          "adverb": null,
          "explanation": {
            "translation": ?,
            "type": ?,
            "tip": ?
          }
        }

        Otro ejemplo de salida JSON:
        {
          "word": "office",
          "verb": null,
          "noun": "office -> oficina",
          "adjective": null,
          "adverb": null,
          "explanation": {
              "translation": "oficina",
              "type": "sustantivo",
              "tip": ?
          }
      }

      La palabra: ${word}
        `,
      },
    ],
    model: 'gpt-3.5-turbo-1106',
    temperature: 0,
    max_tokens: 200,
    response_format: {
      type: 'json_object',
    },
  });

  const jsonResponse = JSON.parse(completion.choices[0].message.content);

  return jsonResponse;
};
