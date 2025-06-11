'use server';

/**
 * @fileOverview Suggests AI-generated background images that complement a foreground image.
 *
 * - suggestAiBackground -  A function that generates background image suggestions.
 * - SuggestAiBackgroundInput - The input type for the suggestAiBackground function.
 * - SuggestAiBackgroundOutput - The return type for the suggestAiBackground function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAiBackgroundInputSchema = z.object({
  foregroundImage: z
    .string()
    .describe(
      'The foreground image to match a background to, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // as a data URI
    ),
  numSuggestions: z
    .number()
    .default(3)
    .describe('The number of background image suggestions to generate.'),
});
export type SuggestAiBackgroundInput = z.infer<typeof SuggestAiBackgroundInputSchema>;

const SuggestAiBackgroundOutputSchema = z.object({
  backgroundImages: z.array(
    z
      .string()
      .describe(
        'A data URI containing the generated background image, which must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
      )
  ),
});
export type SuggestAiBackgroundOutput = z.infer<typeof SuggestAiBackgroundOutputSchema>;

export async function suggestAiBackground(input: SuggestAiBackgroundInput): Promise<SuggestAiBackgroundOutput> {
  return suggestAiBackgroundFlow(input);
}

const suggestAiBackgroundPrompt = ai.definePrompt({
  name: 'suggestAiBackgroundPrompt',
  input: {schema: SuggestAiBackgroundInputSchema},
  output: {schema: SuggestAiBackgroundOutputSchema},
  prompt: `Given the following foreground image, generate {{numSuggestions}} different background images that would be suitable.

Foreground Image: {{media url=foregroundImage}}

Each background image should complement the foreground image in terms of color palette, style, and overall aesthetic.

Return the images as data URIs.

Make sure each image is different.`,
});

const suggestAiBackgroundFlow = ai.defineFlow(
  {
    name: 'suggestAiBackgroundFlow',
    inputSchema: SuggestAiBackgroundInputSchema,
    outputSchema: SuggestAiBackgroundOutputSchema,
  },
  async input => {
    const backgroundImages: string[] = [];
    for (let i = 0; i < input.numSuggestions; i++) {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp',
        prompt: [
          {media: {url: input.foregroundImage}},
          {text: 'generate a background image to suit the main object'},
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });
      backgroundImages.push(media.url!);
    }
    return {backgroundImages};
  }
);
