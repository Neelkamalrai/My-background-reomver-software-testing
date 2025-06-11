'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, UploadCloud, Download, Wand2, AlertCircle, ImageUp, Trash2 } from 'lucide-react';
import { removeBackground } from '@/ai/flows/remove-background';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export function ImageUploadClient() {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [processedImageSrc, setProcessedImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };
  
  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, GIF, etc.).');
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }
    setError(null);
    setProcessedImageSrc(null);
    setOriginalImageFile(file);
    try {
      const base64 = await toBase64(file);
      setOriginalImageSrc(base64);
    } catch (err) {
      console.error("Error converting file to base64", err);
      setError("Could not load image preview.");
       toast({
        title: "Image Preview Error",
        description: "Could not load the image preview. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveBackground = async () => {
    if (!originalImageSrc) {
      setError('Please upload an image first.');
      toast({
        title: "No Image",
        description: "Please upload an image before removing the background.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    setProcessedImageSrc(null);

    try {
      const result = await removeBackground({ image: originalImageSrc });
      setProcessedImageSrc(result.image);
      toast({
        title: "Background Removed!",
        description: "Your image is ready for download.",
      });
    } catch (err) {
      console.error('Error removing background:', err);
      setError('Failed to remove background. Please try again.');
      toast({
        title: "Processing Error",
        description: "Failed to remove background. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!processedImageSrc || !originalImageFile) return;
    const link = document.createElement('a');
    link.href = processedImageSrc;
    const fileNameParts = originalImageFile.name.split('.');
    const extension = fileNameParts.pop();
    const nameWithoutExtension = fileNameParts.join('.');
    link.download = `${nameWithoutExtension}_nobg.png`; // Suggest PNG for transparency
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
     toast({
        title: "Download Started",
        description: `Downloading ${link.download}`,
      });
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
     await processFile(file);
    }
  };

  const handleRemoveImage = () => {
    setOriginalImageFile(null);
    setOriginalImageSrc(null);
    setProcessedImageSrc(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl animate-in fade-in-50 duration-700">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-center">Upload Your Image</CardTitle>
        <CardDescription className="text-center">
          Remove the background from any image with a single click.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!originalImageSrc && (
          <div
            className={cn(
              "border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors",
              isDragging && "border-primary bg-accent/10"
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <ImageUp className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="font-semibold text-lg">Drag & drop your image here</p>
            <p className="text-muted-foreground">or click to browse</p>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="imageUpload"
            />
             <p className="text-xs text-muted-foreground mt-2">Supports PNG, JPG, GIF, WEBP</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {originalImageSrc && (
            <div className="space-y-2 animate-in fade-in duration-500">
              <h3 className="text-lg font-semibold text-center">Original Image</h3>
              <div className="relative aspect-square border rounded-md overflow-hidden shadow-sm">
                <Image src={originalImageSrc} alt="Original" layout="fill" objectFit="contain" />
              </div>
               <Button variant="outline" size="sm" onClick={handleRemoveImage} className="w-full">
                <Trash2 className="mr-2 h-4 w-4" /> Remove Image
              </Button>
            </div>
          )}

          {processedImageSrc && (
            <div className="space-y-2 animate-in fade-in duration-500 delay-200">
              <h3 className="text-lg font-semibold text-center">Processed Image</h3>
               <div className="relative aspect-square border rounded-md overflow-hidden shadow-sm bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%278%27%20height%3D%278%27%20viewBox%3D%270%200%208%208%27%3E%3Cpath%20fill%3D%27%23ccc%27%20d%3D%27M0%200h4v4H0zM4%204h4v4H4z%27%2F%3E%3C%2Fsvg%3E')]">
                <Image src={processedImageSrc} alt="Processed" layout="fill" objectFit="contain" />
              </div>
            </div>
          )}
        </div>
        
        {originalImageSrc && !processedImageSrc && !isLoading && (
           <Button onClick={handleRemoveBackground} disabled={isLoading || !originalImageSrc} className="w-full mt-4 text-lg py-6 group transition-all hover:shadow-md">
            <Wand2 className="mr-2 h-5 w-5 group-hover:animate-ping" />
            {isLoading ? 'Processing...' : 'Remove Background'}
          </Button>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8 space-y-2">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Removing background, please wait...</p>
          </div>
        )}

      </CardContent>
      {processedImageSrc && (
        <CardFooter>
          <Button onClick={handleDownload} disabled={!processedImageSrc} className="w-full text-lg py-6 group transition-all hover:shadow-md">
            <Download className="mr-2 h-5 w-5 group-hover:translate-y-0.5" />
            Download Processed Image
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
