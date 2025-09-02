import { useEffect, useState } from 'react';
import { useBackgroundRemoval } from '@/hooks/useBackgroundRemoval';

interface LogoProcessorProps {
  originalImageUrl: string;
  alt: string;
  className?: string;
}

export const LogoProcessor = ({ originalImageUrl, alt, className }: LogoProcessorProps) => {
  const { processImage, isProcessing, processedImageUrl } = useBackgroundRemoval();
  const [currentImageUrl, setCurrentImageUrl] = useState(originalImageUrl);

  useEffect(() => {
    const processLogo = async () => {
      try {
        const processed = await processImage(originalImageUrl);
        setCurrentImageUrl(processed);
      } catch (error) {
        console.error('Failed to process logo:', error);
        // Fallback to original image
        setCurrentImageUrl(originalImageUrl);
      }
    };

    processLogo();
  }, [originalImageUrl, processImage]);

  return (
    <img 
      src={currentImageUrl} 
      alt={alt} 
      className={`${className} ${isProcessing ? 'opacity-75' : ''}`}
    />
  );
};