'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Download, FileText, Sparkles, BookText, ShieldCheck } from 'lucide-react';
import type { TranscriptionSegment } from '@/ai/schemas';
import { Badge } from '@/components/ui/badge';
import { Document, Packer, Paragraph, TextRun } from 'docx';

interface TranscriptionEditorProps {
  initialTranscription: TranscriptionSegment[];
  summary: string;
  fileName: string;
  anonymized: boolean;
}

export function TranscriptionEditor({
  initialTranscription,
  summary,
  fileName,
  anonymized,
}: TranscriptionEditorProps) {
  const [editedTranscription, setEditedTranscription] = useState(initialTranscription);

  useEffect(() => {
    setEditedTranscription(initialTranscription);
  }, [initialTranscription]);

  const handleTextChange = (index: number, newText: string) => {
    const updatedTranscription = [...editedTranscription];
    updatedTranscription[index].text = newText;
    setEditedTranscription(updatedTranscription);
  };
  
  const handleExport = (format: 'txt' | 'docx') => {
    const baseName = fileName.split('.').slice(0, -1).join('.') || fileName;

    const downloadFile = (blob: Blob, downloadName: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    if (format === 'txt') {
      const textToExport = editedTranscription
        .map(segment => `[${segment.timestamp}] ${segment.speaker}: ${segment.text}`)
        .join('\n\n');
      const blob = new Blob([textToExport], { type: 'text/plain;charset=utf-8' });
      downloadFile(blob, `${baseName}_transcription.txt`);
      return;
    }

    if (format === 'docx') {
      const doc = new Document({
        sections: [{
          children: editedTranscription.map(
            (segment) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `[${segment.timestamp}] ${segment.speaker}: `,
                    bold: true,
                  }),
                  new TextRun(segment.text),
                ],
                spacing: { after: 240 }, // Adds space after each segment
              })
          ),
        }],
      });

      Packer.toBlob(doc).then(blob => {
        downloadFile(blob, `${baseName}_transcription.docx`);
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-accent" />
                <CardTitle>Transcription Editor</CardTitle>
              </div>
              {anonymized && (
                <Badge variant="secondary" className="gap-1.5 pl-2">
                  <ShieldCheck className="w-4 h-4 text-green-600"/>
                  PII Redacted
                </Badge>
              )}
            </div>
            <CardDescription>
              Review and edit the AI-generated transcription below.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden pt-0">
            <div className="space-y-6 h-full overflow-y-auto pr-4">
              {editedTranscription.map((segment, index) => (
                <div key={index} className="grid grid-cols-[max-content_1fr] gap-4 items-start">
                  <div className="flex flex-col items-start pt-1.5 gap-1">
                      <div className="font-semibold text-primary text-sm whitespace-nowrap">{segment.speaker}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {segment.timestamp}
                      </div>
                  </div>
                  <Textarea
                    value={segment.text}
                    onChange={(e) => handleTextChange(index, e.target.value)}
                    className="text-base w-full min-h-[60px]"
                    aria-label={`Transcription segment from ${segment.speaker} at ${segment.timestamp}`}
                  />
                </div>
              ))}
            </div>
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
