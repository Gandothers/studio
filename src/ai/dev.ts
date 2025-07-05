import { config } from 'dotenv';
config();

import '@/ai/flows/anonymize-transcription.ts';
import '@/ai/flows/improve-accuracy.ts';
import '@/ai/flows/summarize-transcription.ts';
import '@/ai/flows/transcribe-audio.ts';
