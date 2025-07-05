import { MicVocal } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <MicVocal className="h-9 w-9 text-primary" />
      <h1 className="text-4xl font-semibold text-foreground tracking-tight">
        Tscribe
      </h1>
    </div>
  );
}
