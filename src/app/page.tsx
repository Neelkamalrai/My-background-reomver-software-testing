import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';
import { HeroSection } from '@/components/HeroSection';
import { ImageUploadClient } from '@/components/ImageUploadClient';
import { FeatureShowcaseSection } from '@/components/FeatureShowcaseSection';

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <HeroSection />
        
        <section id="tool" className="py-16 md:py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <ImageUploadClient />
          </div>
        </section>

        <FeatureShowcaseSection />

      </main>
      <AppFooter />
    </>
  );
}
