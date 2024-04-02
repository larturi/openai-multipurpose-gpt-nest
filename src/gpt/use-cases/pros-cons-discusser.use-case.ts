import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDiscusserUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt } = options;

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
        Se te dara una pregunta y tu tarea es dar una respuesta con pros y contras.
        La respuesta debe ser en formato markdown.
        Los pros y contras deben estar en una lista con el siguiente formato:

        ## [Terminino1] vs [Terminino2]
        
        ### [Terminino1]
        
        #### **Pros:**
        - Pro-1
        - Pro-2
        - Pro-n
        
        #### **Contras:**
        - Contra-1
        - Contra-2
        - Contra-n
        
        ### [Terminino2]
        
        #### **Pros:**
        - Pro-1
        - Pro-2
        - Pro-n
        
        #### **Contras:**
        - Contra-1
        - Contra-2
        - Contra-n
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
