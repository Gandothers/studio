'use client';

import { useState, useEffect } from 'react';
import { improveTranscriptionAccuracy, type TranscriptionSegment } from '@/ai/flows/improve-accuracy';
import { summarizeTranscription } from '@/ai/flows/summarize-transcription';
import { AudioUpload } from '@/components/audio-upload';
import { TranscriptionEditor } from '@/components/transcription-editor';
import { Logo } from '@/components/logo';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileAudio, Hourglass, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Status = 'idle' | 'transcribing' | 'editing' | 'error';

// Dummy text to simulate a real transcription before AI improvement
const DUMMY_TRANSCRIPTION =
  'Speaker 1: Hello, is this thing on? Speaker 2: Yes, I can hear you. How are you? Speaker 1: I am doing great, thanks for asking! I was just wondering if this transcription service can handle multiple speakers. Speaker 2: It seems like it can. It should be able to separate our voices and assign timestamps. That\'s pretty neat.';

export default function Home() {
  const [status, setStatus] = useState<Status>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<TranscriptionSegment[]>([]);
  const [summary, setSummary] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'transcribing') {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 5;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [status]);
  
  const handleFileUpload = async (file: File) => {
    setStatus('transcribing');
    setUploadedFile(file);
    setError(null);

    try {
      // Step 1: Simulate transcription and then improve it with AI
      const { improvedTranscription } = await improveTranscriptionAccuracy({
        transcription: DUMMY_TRANSCRIPTION,
      });
      setTranscription(improvedTranscription);
      setProgress(95);

      // Step 2: Summarize the improved transcription with AI
      const textToSummarize = improvedTranscription.map(segment => segment.text).join(' ');
      const { summary: aiSummary } = await summarizeTranscription({
        transcription: textToSummarize,
      });
      setSummary(aiSummary);
      setProgress(100);

      // Add a small delay to show 100% progress before switching view
      setTimeout(() => {
        setStatus('editing');
      }, 500);

    } catch (e) {
      console.error(e);
      setError('An error occurred during transcription. Please try again.');
      setStatus('error');
    }
  };

  const resetState = () => {
    setStatus('idle');
    setUploadedFile(null);
    setTranscription([]);
    setSummary('');
    setProgress(0);
    setError(null);
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      <header className="flex flex-col items-center text-center mb-12">
        <Logo />
        <p className="mt-2 text-lg text-muted-foreground">
          Upload an audio file and get an AI-powered transcription and summary.
        </p>
      </header>

      <div className="flex flex-col items-center gap-8">
        {status === 'idle' && (
          <AudioUpload onFileUpload={handleFileUpload} disabled={status !== 'idle'}/>
        )}

        {(status === 'transcribing' || status === 'error') && uploadedFile && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileAudio /> {uploadedFile.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {status === 'transcribing' && (
                <div className="flex items-center gap-4">
                  <Hourglass className="animate-spin" />
                  <div className="w-full space-y-2">
                    <p className="text-sm text-muted-foreground">
                      AI is transcribing and analyzing...
                    </p>
                    <Progress value={progress} className="w-full" />
                  </div>
                </div>
              )}
              {status === 'error' && error && (
                 <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {error} <button onClick={resetState} className="underline font-semibold">Try again</button>.
                    </AlertDescription>
                  </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {status === 'editing' && uploadedFile && (
          <>
            <button onClick={resetState} className="text-sm text-primary hover:underline self-start">
              &larr; Transcribe another file
            </button>
            <TranscriptionEditor
              initialTranscription={transcription}
              summary={summary}
              fileName={uploadedFile.name}
            />
          </>
        )}
      </div>

       <footer className="text-center mt-16 text-sm text-muted-foreground">
        <p>Built with Next.js and Genkit AI.</p>
      </footer>
    </main>
  );
}
