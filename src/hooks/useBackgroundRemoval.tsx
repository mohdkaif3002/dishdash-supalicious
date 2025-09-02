import { useState, useCallback } from 'react';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';

export const useBackgroundRemoval = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

  const processImage = useCallback(async (imageUrl: string) => {
    setIsProcessing(true);
    try {
      // Fetch the image as blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Load image element
      const imageElement = await loadImage(blob);
      
      // Remove background
      const processedBlob = await removeBackground(imageElement);
      
      // Create URL for processed image
      const processedUrl = URL.createObjectURL(processedBlob);
      setProcessedImageUrl(processedUrl);
      
      return processedUrl;
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    processImage,
    isProcessing,
    processedImageUrl
  };
};