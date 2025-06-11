'use server';
/**
 * @fileOverview An AI-powered background removal tool.
 * This version uses Claid.ai API for background removal.
 *
 * - removeBackground - Removes the background from an image using Claid.ai.
 * - RemoveBackgroundInput - The input type for the removeBackground function.
 * - RemoveBackgroundOutput - The return type for the removeBackground function.
 */

import {ai} from '@/ai/genkit'; // ai object might still be used by other flows or if we revert
import {z} from 'genkit';
import axios from 'axios';
// import { Buffer } from 'buffer'; // Buffer is usually global in Node.js environments

const RemoveBackgroundInputSchema = z.object({
  image: z
    .string()
    .describe(
      "The image to remove the background from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RemoveBackgroundInput = z.infer<typeof RemoveBackgroundInputSchema>;

const RemoveBackgroundOutputSchema = z.object({
  image: z.string().describe('The image with the background removed, as a data URI.'),
});
export type RemoveBackgroundOutput = z.infer<typeof RemoveBackgroundOutputSchema>;

export async function removeBackground(input: RemoveBackgroundInput): Promise<RemoveBackgroundOutput> {
  if (!process.env.CLAID_API_KEY) {
    console.error('CLAID_API_KEY is not set in environment variables.');
    throw new Error('CLAID_API_KEY is not configured.');
  }

  const claidPayload = {
    input: { image: input.image }, // Claid.ai supports data URI here
    operations: [
      { type: 'remove_background' },
    ],
    output: { format: 'png' } // Request PNG for transparency
  };

  try {
    const claidResponse = await axios.post(
      'https://api.claid.ai/v1-beta1/image/edit',
      claidPayload,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CLAID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (claidResponse.data && claidResponse.data.status === 'succeeded' && claidResponse.data.output && claidResponse.data.output.tmp_url) {
      const imageUrl = claidResponse.data.output.tmp_url;
      
      // Fetch the image from the temporary URL
      const imageGetResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageGetResponse.data); // No 'binary' encoding needed for arraybuffer
      const base64Image = imageBuffer.toString('base64');
      const mimeType = imageGetResponse.headers['content-type'] || 'image/png';

      return { image: `data:${mimeType};base64,${base64Image}` };
    } else if (claidResponse.data && claidResponse.data.output && claidResponse.data.output.url && claidResponse.data.output.url.startsWith('data:')) {
      // Fallback if Claid.ai ever returns a data URI directly in 'url'
      return { image: claidResponse.data.output.url };
    } else {
      console.error('Unexpected Claid.ai response structure or failed operation:', claidResponse.data);
      throw new Error(`Claid.ai processing failed. Status: ${claidResponse.data?.status}. Details: ${JSON.stringify(claidResponse.data?.errors || claidResponse.data)}`);
    }

  } catch (error) {
    console.error('Error calling Claid.ai API:');
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Headers:', error.response?.headers);
      throw new Error(`Claid.ai API Error: ${error.response?.status} - ${JSON.stringify(error.response?.data || error.message)}`);
    } else {
      console.error(error.message);
      throw new Error(`Failed to process image with Claid.ai: ${error.message}`);
    }
  }
}

/*
// The following Genkit prompt and flow definition are commented out as
// the `removeBackground` function now directly uses Claid.ai API.

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
    // This was the previous implementation using Google AI through Genkit
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
*/
