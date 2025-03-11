
import { GeneratedImage } from './openai';

const STORAGE_KEY = 'dalle-generated-images';

export const saveGeneratedImage = (image: GeneratedImage): void => {
  try {
    const existingImages = getGeneratedImages();
    const updatedImages = [image, ...existingImages];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedImages));
  } catch (error) {
    console.error('Error saving image to localStorage:', error);
  }
};

export const getGeneratedImages = (): GeneratedImage[] => {
  try {
    const imagesJson = localStorage.getItem(STORAGE_KEY);
    return imagesJson ? JSON.parse(imagesJson) : [];
  } catch (error) {
    console.error('Error retrieving images from localStorage:', error);
    return [];
  }
};

export const deleteGeneratedImage = (timestamp: number): void => {
  try {
    const existingImages = getGeneratedImages();
    const updatedImages = existingImages.filter(img => img.timestamp !== timestamp);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedImages));
  } catch (error) {
    console.error('Error deleting image from localStorage:', error);
  }
};

export const clearGeneratedImages = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing images from localStorage:', error);
  }
};

export const saveApiKey = (apiKey: string): void => {
  try {
    localStorage.setItem('openai-api-key', apiKey);
  } catch (error) {
    console.error('Error saving API key to localStorage:', error);
  }
};

export const getApiKey = (): string => {
  try {
    return localStorage.getItem('openai-api-key') || '';
  } catch (error) {
    console.error('Error retrieving API key from localStorage:', error);
    return '';
  }
};
