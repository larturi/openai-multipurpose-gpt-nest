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


        ## Nest: Express vs Fastify
        
        ### Express:
        
        #### **Pros:**
        - Ampliamente utilizado y probado en el mercado.
        - Gran cantidad de middleware y complementos disponibles
        - Documentación extensa y comunidad activa.
        - Flexible y fácil de aprender para desarrolladores principiantes.
        
        #### **Contras:**
        - Puede ser menos eficiente en términos de rendimiento en comparación con Fastify.
        - Algunas características avanzadas pueden requerir la instalación de middleware adicional.- Ha habido críticas sobre su manejo de errores y la falta de soporte para el manejo asíncrono de manera nativa.
        
        ### Fastify:
        
        #### **Pros:**
        - Altamente eficiente y rápido en términos de rendimiento gracias a su arquitectura basada en hooks.
        - Validación de esquemas integrada y fuerte tipado que ayuda a reducir errores.
        - Extensibilidad mediante el uso de plugins.
        - Buena documentación y comunidad activa que está en constante crecimiento.
        
        #### **Contras:**
        - Menos middleware y complementos disponibles en comparación con Express.
        - No tan estable ni probado en comparación con Express.
        - Curva de aprendizaje ligeramente más pronunciada, especialmente para aquellos que no están familiarizados con Node.js.
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
