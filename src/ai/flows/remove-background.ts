// This is an AI-powered background removal tool.
//
// It accepts an image as a data URI and returns the same image with the background removed.
// - removeBackground - Removes the background from an image.
// - RemoveBackgroundInput - The input type for the removeBackground function.
// - RemoveBackgroundOutput - The return type for the removeBackground function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RemoveBackgroundInputSchema = z.object({
  image: z
    .string()
    .describe(
      'The image to remove the background from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type RemoveBackgroundInput = z.infer<typeof RemoveBackgroundInputSchema>;

const RemoveBackgroundOutputSchema = z.object({
  image: z.string().describe('The image with the background removed, as a data URI.'),
});
export type RemoveBackgroundOutput = z.infer<typeof RemoveBackgroundOutputSchema>;

export async function removeBackground(input: RemoveBackgroundInput): Promise<RemoveBackgroundOutput> {
  return removeBackgroundFlow(input);
}

const removeBackgroundPrompt = ai.definePrompt({
  name: 'removeBackgroundPrompt',
  input: {schema: RemoveBackgroundInputSchema},
  output: {schema: RemoveBackgroundOutputSchema},
  prompt: `Remove the background from this image: {{media url=image}}.

  Return the image with the background removed as a data URI.
  `,
});

const removeBackgroundFlow = ai.defineFlow(
  {
    name: 'removeBackgroundFlow',
    inputSchema: RemoveBackgroundInputSchema,
    outputSchema: RemoveBackgroundOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: [{media: {url: input.image}, text: 'remove background'}],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {image: media.url!};
  }
);
