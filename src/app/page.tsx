'use client';

import { useState } from 'react';
import { improveTranscriptionAccuracy } from '@/ai/flows/improve-accuracy';
import type { TranscriptionSegment } from '@/ai/schemas';
import { summarizeTranscription } from '@/ai/flows/summarize-transcription';
import { transcribeAudio } from '@/ai/flows/transcribe-audio';
import { AudioUpload } from '@/components/audio-upload';
import { TranscriptionEditor } from '@/components/transcription-editor';
import { Logo } from '@/components/logo';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileAudio, Hourglass, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { anonymizeTranscription } from '@/ai/flows/anonymize-transcription';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type Status = 'idle' | 'transcribing' | 'editing' | 'error';

// Helper function to convert a File object to a data URI
const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function Home() {
  const [status, setStatus] = useState<Status>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<TranscriptionSegment[]>([]);
  const [summary, setSummary] = useState('');
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasConsented, setHasConsented] = useState(false);
  const [anonymize, setAnonymize] = useState(true);
  const [wasAnonymized, setWasAnonymized] = useState(false);
  const [language, setLanguage] = useState('English');

  const handleFileUpload = async (file: File) => {
    setStatus('transcribing');
    setUploadedFile(file);
    setError(null);
    setProgress(0);
    setWasAnonymized(false);

    try {
      setProgressMessage('Uploading and preparing audio...');
      const audioDataUri = await fileToDataUri(file);
      setProgress(10);

      setProgressMessage('Transcribing audio...');
      const { transcription: rawTranscription } = await transcribeAudio({ audioDataUri, language });
      setProgress(40);
      
      setProgressMessage('Improving accuracy and adding timestamps...');
      const { improvedTranscription } = await improveTranscriptionAccuracy({
        transcription: rawTranscription,
        audioDataUri,
      });
      setProgress(70);

      let finalTranscription = improvedTranscription;

      if (anonymize) {
        setProgressMessage('Redacting sensitive information (PII)...');
        setWasAnonymized(true);
        const { anonymizedTranscription } = await anonymizeTranscription({
            transcription: improvedTranscription,
        });
        finalTranscription = anonymizedTranscription;
        setProgress(95);
      } else {
        setProgress(95);
      }
      
      setTranscription(finalTranscription);

      setProgressMessage('Generating summary...');
      const textToSummarize = finalTranscription.map(segment => segment.text).join(' ');
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
    setProgressMessage('');
    setHasConsented(false);
    setWasAnonymized(false);
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      <header className="flex flex-col items-center text-center mb-12">
        <Logo />
        <p className="mt-4 max-w-lg text-lg text-muted-foreground">
          Upload your audio. We use AI to transcribe, redact, and summarize it for you.
        </p>
      </header>

      <div className="flex flex-col items-center gap-8">
        {status === 'idle' && (
          <div className="w-full max-w-2xl space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Checkbox id="consent" className="mt-0.5" checked={hasConsented} onCheckedChange={(checked) => setHasConsented(checked as boolean)} />
                  <Label htmlFor="consent" className="text-sm font-normal text-muted-foreground leading-snug cursor-pointer -mt-1">
                    I acknowledge my audio will be processed by AI. I am responsible for the content I upload and will not upload sensitive Protected Health Information (PHI).
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Switch id="anonymize-switch" checked={anonymize} onCheckedChange={setAnonymize} />
                    <Label htmlFor="anonymize-switch" className="cursor-pointer">Enable PII Redaction</Label>
                  </div>
                   <p className="text-xs text-muted-foreground pl-11">
                      Helps enhance privacy by removing personal information. This is not a compliance guarantee.
                   </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language-select">Audio Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language-select" className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Mandarin Chinese">Mandarin Chinese</SelectItem>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Portuguese">Portuguese</SelectItem>
                      <SelectItem value="Arabic">Arabic</SelectItem>
                      <SelectItem value="Russian">Russian</SelectItem>
                      <SelectItem value="auto">Other (Auto-Detect)</SelectItem>
                    </SelectContent>
                  </Select>
                   <p className="text-xs text-muted-foreground">
                    Specifying the language can improve transcription accuracy.
                   </p>
                </div>
              </div>
            </Card>
            <AudioUpload onFileUpload={handleFileUpload} disabled={status !== 'idle' || !hasConsented} />
          </div>
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
                      {progressMessage || 'AI is transcribing and analyzing...'}
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
              anonymized={wasAnonymized}
            />
          </>
        )}
      </div>

       <footer className="text-center mt-24 text-sm text-muted-foreground">
        <Separator className="w-1/2 mx-auto mb-4" />
        <p>Powered by Next.js and Genkit</p>
      </footer>
    </main>
  );
}
