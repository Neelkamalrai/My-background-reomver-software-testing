import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Wand2 } from 'lucide-react';

const features = [
  {
    title: "Precision Background Removal",
    description: "Our AI meticulously identifies and removes backgrounds, leaving you with a clean, professional cutout.",
    icon: <Wand2 className="h-8 w-8 text-primary mb-4" />,
    imageBefore: "https://placehold.co/600x400.png",
    imageAfter: "https://placehold.co/600x400.png",
    hintBefore: "product photography",
    hintAfter: "product transparent",
  },
  {
    title: "AI-Powered Accuracy",
    description: "Leverage cutting-edge AI models for unparalleled accuracy, even with complex edges and fine details like hair.",
    icon: <CheckCircle className="h-8 w-8 text-primary mb-4" />,
    imageBefore: "https://placehold.co/600x400.png",
    imageAfter: "https://placehold.co/600x400.png",
    hintBefore: "portrait model",
    hintAfter: "portrait transparent",
  },
];

export function FeatureShowcaseSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">Why Choose PixelClean?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Experience the next level of image editing with our powerful AI features.
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 animate-in fade-in-50 slide-in-from-bottom-10 duration-700" style={{animationDelay: `${index * 150}ms`}}>
              <CardHeader className="items-center text-center">
                {feature.icon}
                <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 items-center">
                  <div>
                    <h3 className="text-center font-semibold mb-2">Before</h3>
                    <Image
                      src={feature.imageBefore}
                      alt={`${feature.title} - Before`}
                      width={600}
                      height={400}
                      className="rounded-md object-cover aspect-video"
                      data-ai-hint={feature.hintBefore}
                    />
                  </div>
                  <div>
                    <h3 className="text-center font-semibold mb-2">After</h3>
                    <Image
                      src={feature.imageAfter}
                      alt={`${feature.title} - After`}
                      width={600}
                      height={400}
                      className="rounded-md object-cover aspect-video bg-slate-200" // Added bg for visibility of transparent placeholders
                      data-ai-hint={feature.hintAfter}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
            <h3 className="text-2xl font-bold mb-4 font-headline">Explore Creative Backgrounds</h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
                While our core feature is precise background removal, imagine the possibilities! Here are some AI-generated backgrounds that could complement your subject.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                    { src: "https://placehold.co/400x300.png", hint: "abstract colorful" },
                    { src: "https://placehold.co/400x300.png", hint: "nature landscape" },
                    { src: "https://placehold.co/400x300.png", hint: "studio backdrop" },
                ].map((bg, idx) => (
                    <div key={idx} className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500" style={{animationDelay: `${idx * 100 + 500}ms`}}>
                        <Image
                            src={bg.src}
                            alt={`AI Suggested Background ${idx + 1}`}
                            width={400}
                            height={300}
                            className="rounded-lg object-cover aspect-video shadow-md hover:scale-105 transition-transform duration-300"
                            data-ai-hint={bg.hint}
                        />
                    </div>
                ))}
            </div>
             <p className="text-sm text-muted-foreground mt-4">
                Note: PixelClean currently provides transparent background images for download. These are examples of further creative enhancements.
            </p>
        </div>
      </div>
    </section>
  );
}
