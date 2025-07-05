'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Download, FileText, Sparkles, BookText } from 'lucide-react';

interface TranscriptionEditorProps {
  initialTranscription: string;
  summary: string;
  fileName: string;
}

export function TranscriptionEditor({
  initialTranscription,
  summary,
  fileName,
}: TranscriptionEditorProps) {
  const [editedTranscription, setEditedTranscription] = useState(initialTranscription);

  useEffect(() => {
    setEditedTranscription(initialTranscription);
  }, [initialTranscription]);
  
  const handleExport = (format: 'txt' | 'docx') => {
    const blob = new Blob([editedTranscription], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const baseName = fileName.split('.').slice(0, -1).join('.') || fileName;
    link.download = `${baseName}_transcription.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              <CardTitle>Transcription Editor</CardTitle>
            </div>
            <CardDescription>
              Review and edit the AI-generated transcription below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={editedTranscription}
              onChange={(e) => setEditedTranscription(e.target.value)}
              className="min-h-[400px] text-base"
              aria-label="Transcription text editor"
            />
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookText className="w-6 h-6 text-accent" />
              <CardTitle>AI Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{summary || "No summary available."}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
             <Button onClick={() => handleExport('txt')} variant="outline">
              <FileText />
              Export as .txt
            </Button>
            <Button onClick={() => handleExport('docx')}>
              <Download />
              Export as .docx
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
