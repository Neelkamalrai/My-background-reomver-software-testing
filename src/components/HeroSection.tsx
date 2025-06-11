import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-background to-secondary">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 font-headline animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Remove Backgrounds Instantly with <span className="text-primary">PixelClean</span> AI
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          Effortlessly erase backgrounds from your images. Perfect for e-commerce, marketing, or personal projects. Fast, simple, and AI-powered.
        </p>
        <Link href="#tool" passHref>
          <Button size="lg" className="animate-in fade-in zoom-in-90 duration-700 delay-500 group transition-all hover:shadow-lg hover:scale-105 active:scale-95">
            <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
            Get Started Now
          </Button>
        </Link>
      </div>
    </section>
  );
}
