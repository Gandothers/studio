'use server';

/**
 * @fileOverview Implements a Genkit flow to improve transcription accuracy and structure it with speaker tags and timestamps.
 *
 * - improveTranscriptionAccuracy - A function that enhances transcription accuracy using AI.
 * - ImproveTranscriptionAccuracyInput - The input type for the improveTranscriptionAccuracy function.
 * - ImproveTranscriptionAccuracyOutput - The return type for the improveTranscriptionAccuracy function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import {TranscriptionSegmentSchema} from '@/ai/schemas';

const ImproveTranscriptionAccuracyInputSchema = z.object({
  transcription: z
    .string()
    .describe('The initial transcription of the audio.'),
  audioDataUri: z
    .string()
    .describe(
      'The original audio file, as a data URI. This will be used as the source of truth to correct the transcription.'
    ),
});
export type ImproveTranscriptionAccuracyInput = z.infer<
  typeof ImproveTranscriptionAccuracyInputSchema
>;

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

const improveTranscriptionAccuracyFlow = ai.defineFlow(
  {
    name: 'improveTranscriptionAccuracyFlow',
    inputSchema: ImproveTranscriptionAccuracyInputSchema,
    outputSchema: ImproveTranscriptionAccuracyOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      model: googleAI.model('gemini-1.5-pro'),
      prompt: [
        {
          text: `You are an AI expert in improving and structuring transcriptions.
You have been given an audio file and a raw, potentially inaccurate transcription of that audio.
Your task is to listen to the audio and correct the transcription to be as accurate as possible.

Your goals are:
1.  **Maximize Accuracy**: Use the audio file as the ultimate source of truth. Correct spelling, grammar, missed words, and incorrect words in the initial transcription.
2.  **Structure the Content**: Identify each speaker and label them sequentially (e.g., "Speaker 1", "Speaker 2").
3.  **Add Timestamps**: Assign a plausible timestamp in HH:MM:SS format to the beginning of each speaker's segment, starting from 00:00:00. The timestamps should correspond to the timing in the audio.

The final output MUST be an array of objects as described by the output schema, with each object containing a speaker, a timestamp, and the corresponding text.

Initial Transcription to be corrected:
${input.transcription}
`,
        },
        {media: {url: input.audioDataUri}},
      ],
      output: {
        schema: ImproveTranscriptionAccuracyOutputSchema,
      },
      config: {
        temperature: 0.1, // Lower temperature for more deterministic, accurate output
      },
    });

    return output!;
  }
);
