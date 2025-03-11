
import { toast } from "sonner";

export interface ImageGenerationParams {
  prompt: string;
  n?: number;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  apiKey: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export const generateImage = async ({
  prompt,
  n = 1,
  size = '1024x1024',
  quality = 'standard',
  style = 'vivid',
  apiKey
}: ImageGenerationParams): Promise<GeneratedImage | null> => {
  if (!apiKey) {
    toast.error("Please provide an OpenAI API key");
    return null;
  }

  if (!prompt) {
    toast.error("Please provide a prompt");
    return null;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt,
        n,
        size,
        quality,
        style,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate image');
    }

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      return {
        url: data.data[0].url,
        prompt,
        timestamp: Date.now()
      };
    }
    
    throw new Error('No image data returned');
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
      console.error('Image generation error:', error);
    } else {
      toast.error('An unexpected error occurred');
      console.error('Unknown error:', error);
    }
    return null;
  }
};
