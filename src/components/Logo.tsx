import { TowTruck } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
        <TowTruck className="h-7 w-7 text-primary-foreground" />
      </div>
      <span className="text-2xl font-bold tracking-tighter text-foreground">T-Tow</span>
    </div>
  );
}
