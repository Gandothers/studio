'use server';

/**
 * @fileOverview This file contains the Genkit flow for summarizing transcribed text.
 *
 * - summarizeTranscription - A function that takes transcribed text as input and returns a concise summary.
 * - SummarizeTranscriptionInput - The input type for the summarizeTranscription function.
 * - SummarizeTranscriptionOutput - The return type for the summarizeTranscription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTranscriptionInputSchema = z.object({
  transcription: z.string().describe('The transcribed text to summarize.'),
});
export type SummarizeTranscriptionInput = z.infer<typeof SummarizeTranscriptionInputSchema>;

const SummarizeTranscriptionOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the transcribed text.'),
  progress: z.string().describe('Progress of the summarization process'),
});
export type SummarizeTranscriptionOutput = z.infer<typeof SummarizeTranscriptionOutputSchema>;

export async function summarizeTranscription(input: SummarizeTranscriptionInput): Promise<SummarizeTranscriptionOutput> {
  return summarizeTranscriptionFlow(input);
}

const summarizeTranscriptionPrompt = ai.definePrompt({
  name: 'summarizeTranscriptionPrompt',
  input: {schema: SummarizeTranscriptionInputSchema},
  output: {schema: SummarizeTranscriptionOutputSchema},
  prompt: `You are an expert summarizer. Please provide a concise summary of the following transcribed text:\n\n{{{transcription}}}`,
});

const summarizeTranscriptionFlow = ai.defineFlow(
  {
    name: 'summarizeTranscriptionFlow',
    inputSchema: SummarizeTranscriptionInputSchema,
    outputSchema: SummarizeTranscriptionOutputSchema,
  },
  async input => {
    const {output} = await summarizeTranscriptionPrompt(input);
    output!.progress = 'Generated a short summary of the transcribed text.';
    return output!;
  }
);
