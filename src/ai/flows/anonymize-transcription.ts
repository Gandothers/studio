'use server';

/**
 * @fileOverview A Genkit flow for anonymizing transcriptions by redacting personally identifiable information (PII).
 *
 * - anonymizeTranscription - A function that takes transcription segments and returns them with PII redacted.
 * - AnonymizeTranscriptionInput - The input type for the anonymizeTranscription function.
 * - AnonymizeTranscriptionOutput - The return type for the anonymizeTranscription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  TranscriptionSegmentSchema,
  type TranscriptionSegment,
} from '@/ai/schemas';

const AnonymizeTranscriptionInputSchema = z.object({
  transcription: z
    .array(TranscriptionSegmentSchema)
    .describe('An array of transcription segments to be anonymized.'),
});
export type AnonymizeTranscriptionInput = z.infer<
  typeof AnonymizeTranscriptionInputSchema
>;

const AnonymizeTranscriptionOutputSchema = z.object({
  anonymizedTranscription: z
    .array(TranscriptionSegmentSchema)
    .describe(
      'The transcription with PII redacted, preserving speakers and timestamps.'
    ),
});
export type AnonymizeTranscriptionOutput = z.infer<
  typeof AnonymizeTranscriptionOutputSchema
>;

export async function anonymizeTranscription(input: {
  transcription: TranscriptionSegment[];
}): Promise<AnonymizeTranscriptionOutput> {
  return anonymizeTranscriptionFlow(input);
}

// Define a schema specifically for the prompt's input.
const AnonymizePromptInputSchema = z.object({
  transcriptionJson: z.string().describe('A JSON string of the transcription segments to be processed.'),
});


const prompt = ai.definePrompt({
  name: 'anonymizeTranscriptionPrompt',
  input: {schema: AnonymizePromptInputSchema},
  output: {schema: AnonymizeTranscriptionOutputSchema},
  prompt: `You are a privacy and security expert specializing in redacting Personally Identifiable Information (PII) and Protected Health Information (PHI) from text. Your task is to process the provided transcription segments and return them with all sensitive information replaced by placeholders like [REDACTED_NAME], [REDACTED_PHONE], [REDACTED_EMAIL], or [REDACTED_ADDRESS].

You must adhere to the following principles:
- **Compliance**: Your redactions should aim to comply with privacy regulations like GDPR and HIPAA.
- **Accuracy**: Only redact information that is clearly PII or PHI. Do not redact general content.
- **Consistency**: Use consistent placeholders for redacted information.
- **Preserve Structure**: The output JSON must have the exact same structure as the input, including the same number of segments with their original speaker and timestamp information. The \`anonymizedTranscription\` field in the output should contain the processed segments. Only the 'text' field within each segment should be modified.

Here is the list of PII/PHI to redact:
- Names of people
- Phone numbers
- Email addresses
- Physical addresses (street, city, state, zip code)
- Social Security Numbers or other government IDs
- Dates of birth
- Medical record numbers
- Any other information that could uniquely identify an individual.

Process the following transcription segments:
{{{transcriptionJson}}}
`,
});

const anonymizeTranscriptionFlow = ai.defineFlow(
  {
    name: 'anonymizeTranscriptionFlow',
    inputSchema: AnonymizeTranscriptionInputSchema,
    outputSchema: AnonymizeTranscriptionOutputSchema,
  },
  async input => {
    // Stringify the transcription data before passing it to the prompt.
    const {output} = await prompt({
        transcriptionJson: JSON.stringify(input.transcription, null, 2)
    });
    return output!;
  }
);
