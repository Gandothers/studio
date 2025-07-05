import { Mic2 } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Mic2 className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold text-foreground">Tscribe</h1>
    </div>
  );
}
