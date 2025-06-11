import { Zap } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="py-4 shadow-sm bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary font-headline">
          <Zap className="h-8 w-8 text-accent" />
          PixelClean
        </Link>
        <nav>
          {/* Future navigation links can go here */}
        </nav>
      </div>
    </header>
  );
}
