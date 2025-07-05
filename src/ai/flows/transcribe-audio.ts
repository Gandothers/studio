'use server';

/**
 * @fileOverview A Genkit flow for transcribing audio files.
 *
 * - transcribeAudio - A function that transcribes an audio file.
 * - TranscribeAudioInput - The input type for the transcribeAudio function.
 * - TranscribeAudioOutput - The return type for the transcribeAudio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {googleAI} from '@genkit-ai/googleai';

const TranscribeAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().optional().describe('The language of the audio file (e.g., "English", "Spanish"). Providing the language can improve accuracy.'),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

const TranscribeAudioOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the audio.'),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;

export async function transcribeAudio(
  input: TranscribeAudioInput
): Promise<TranscribeAudioOutput> {
  return transcribeAudioFlow(input);
}

const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async input => {
    let promptText = 'Transcribe the following audio file.';

    if (input.language && input.language !== 'auto') {
        promptText = `Transcribe the following audio file. The language spoken in the audio is ${input.language}. Please provide the transcription in that language.`;
    }

    const {text} = await ai.generate({
      model: googleAI.model('gemini-1.5-flash'),
      prompt: [
        {text: promptText},
        {media: {url: input.audioDataUri}},
      ],
    });

    return {
      transcription: text,
    };
  }
);
