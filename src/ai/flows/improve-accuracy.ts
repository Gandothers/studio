'use server';

/**
 * @fileOverview Implements a Genkit flow to improve transcription accuracy and structure it with speaker tags and timestamps.
 *
 * - improveTranscriptionAccuracy - A function that enhances transcription accuracy using AI.
 * - ImproveTranscriptionAccuracyInput - The input type for the improveTranscriptionAccuracy function.
 * - ImproveTranscriptionAccuracyOutput - The return type for the improveTranscriptionAccuracy function.
 * - TranscriptionSegment - The type for a single segment of the transcript, including speaker and timestamp.
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

const TranscriptionSegmentSchema = z.object({
  speaker: z
    .string()
    .describe('The identified speaker (e.g., "Speaker 1", "Speaker 2").'),
  timestamp: z
    .string()
    .describe('The start time of the segment in HH:MM:SS format.'),
  text: z.string().describe('The transcribed text for this segment.'),
});
export type TranscriptionSegment = z.infer<typeof TranscriptionSegmentSchema>;

const ImproveTranscriptionAccuracyOutputSchema = z.object({
  improvedTranscription: z
    .array(TranscriptionSegmentSchema)
    .describe(
      'The transcription with improved accuracy, including timestamps and speaker tags.'
    ),
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
  prompt: `You are an AI expert in improving and structuring transcriptions. Please process the transcription below with the following goals:

1.  **Structure the Content**: Your primary task is to correctly structure the output. Identify each speaker and label them sequentially (e.g., "Speaker 1", "Speaker 2"). Assign a plausible timestamp in HH:MM:SS format to the beginning of each speaker's segment, starting with 00:00:00.
2.  **Improve Accuracy**: While structuring, also improve the accuracy of the text. Correct any clear grammatical errors or spelling mistakes to make the transcription more readable.

The final output MUST be an array of objects as described by the output schema, with each object containing a speaker, a timestamp, and the corresponding text.

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
