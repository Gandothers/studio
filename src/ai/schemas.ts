import {z} from 'zod';

export const TranscriptionSegmentSchema = z.object({
  speaker: z
    .string()
    .describe('The identified speaker (e.g., "Speaker 1", "Speaker 2").'),
  timestamp: z
    .string()
    .describe('The start time of the segment in HH:MM:SS format.'),
  text: z.string().describe('The transcribed text for this segment.'),
});
export type TranscriptionSegment = z.infer<typeof TranscriptionSegmentSchema>;
