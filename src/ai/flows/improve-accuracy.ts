'use server';

/**
 * @fileOverview Implements a Genkit flow to improve transcription accuracy by prioritizing key parts of the text based on sentence structure.
 *
 * - improveTranscriptionAccuracy - A function that enhances transcription accuracy using AI.
 * - ImproveTranscriptionAccuracyInput - The input type for the improveTranscriptionAccuracy function.
 * - ImproveTranscriptionAccuracyOutput - The return type for the improveTranscriptionAccuracy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveTranscriptionAccuracyInputSchema = z.object({
  transcription: z
    .string()
    .describe('The initial transcription of the audio.'),
});
export type ImproveTranscriptionAccuracyInput = z.infer<
  typeof ImproveTranscriptionAccuracyInputSchema
>;

const ImproveTranscriptionAccuracyOutputSchema = z.object({
  improvedTranscription: z
    .string()
    .describe('The transcription with improved accuracy.'),
});
export type ImproveTranscriptionAccuracyOutput = z.infer<
  typeof ImproveTranscriptionAccuracyOutputSchema
>;

export async function improveTranscriptionAccuracy(
  input: ImproveTranscriptionAccuracyInput
): Promise<ImproveTranscriptionAccuracyOutput> {
  return improveTranscriptionAccuracyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveTranscriptionAccuracyPrompt',
  input: {schema: ImproveTranscriptionAccuracyInputSchema},
  output: {schema: ImproveTranscriptionAccuracyOutputSchema},
  prompt: `You are an AI expert in improving the accuracy of transcriptions.

  Given the initial transcription, identify key parts of the text based on sentence structure and prioritize their accuracy. Key parts include subjects, verbs, and objects that carry the most important information.

  Revise the transcription to ensure these key parts are as accurate as possible, correcting any errors or ambiguities.

  Initial Transcription: {{{transcription}}}`,
});

const improveTranscriptionAccuracyFlow = ai.defineFlow(
  {
    name: 'improveTranscriptionAccuracyFlow',
    inputSchema: ImproveTranscriptionAccuracyInputSchema,
    outputSchema: ImproveTranscriptionAccuracyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
