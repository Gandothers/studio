'use client';

import { useState, type DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AudioUploadProps {
  onFileUpload: (file: File) => void;
  disabled?: boolean;
}

export function AudioUpload({ onFileUpload, disabled }: AudioUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const audioFile = files[0];
      if (audioFile.type.startsWith('audio/')) {
        onFileUpload(audioFile);
      } else {
        // You could add a toast notification here for invalid file type
        console.error('Invalid file type. Please upload an audio file.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
       const audioFile = files[0];
       if (audioFile.type.startsWith('audio/')) {
        onFileUpload(audioFile);
      } else {
        console.error('Invalid file type. Please upload an audio file.');
      }
    }
  };

  return (
    <Card className={cn('w-full', { 'border-primary ring-2 ring-primary': isDragging, 'pointer-events-none opacity-50': disabled })}>
      <CardContent className="p-4">
        <label
          htmlFor="audio-input"
          className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/80 transition-colors"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            id="audio-input"
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={disabled}
          />
          <div className="flex flex-col items-center text-center">
            <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="font-semibold text-foreground">
              Drag & drop your audio file here
            </p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: MP3, WAV, M4A, etc.
            </p>
          </div>
        </label>
      </CardContent>
    </Card>
  );
}
