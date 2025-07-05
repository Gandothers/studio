import { Mic2 } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary flex items-center justify-center p-2.5 rounded-lg shadow">
        <Mic2 className="h-7 w-7 text-primary-foreground" />
      </div>
      <h1 className="text-4xl font-bold text-foreground tracking-tight">
        Tscribe
      </h1>
    </div>
  );
}
