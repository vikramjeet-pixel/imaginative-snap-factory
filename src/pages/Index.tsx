
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Trash2Icon, ImageIcon, SettingsIcon, SparklesIcon } from "lucide-react";
import ApiKeyInput from '@/components/ApiKeyInput';
import PromptInput from '@/components/PromptInput';
import ImageDisplay from '@/components/ImageDisplay';
import ImageSettings from '@/components/ImageSettings';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { generateImage, ImageGenerationParams, GeneratedImage } from '@/services/openai';
import { getGeneratedImages, saveGeneratedImage, clearGeneratedImages } from '@/services/localStorage';
import { cn } from '@/lib/utils';

const Index = () => {
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [currentTab, setCurrentTab] = useState("generate");
  const [imageSize, setImageSize] = useState<ImageGenerationParams['size']>('1024x1024');
  const [imageQuality, setImageQuality] = useState<ImageGenerationParams['quality']>('standard');
  const [imageStyle, setImageStyle] = useState<ImageGenerationParams['style']>('vivid');
  
  useEffect(() => {
    setGeneratedImages(getGeneratedImages());
  }, []);
  
  const handleGenerate = async (prompt: string) => {
    if (!apiKey) {
      toast.error("Please provide an OpenAI API key first");
      setCurrentTab("settings");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const result = await generateImage({
        prompt,
        size: imageSize,
        quality: imageQuality,
        style: imageStyle,
        apiKey
      });
      
      if (result) {
        saveGeneratedImage(result);
        setGeneratedImages([result, ...generatedImages]);
        toast.success("Image generated successfully");
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleClearImages = () => {
    if (confirm("Are you sure you want to clear all generated images?")) {
      clearGeneratedImages();
      setGeneratedImages([]);
      toast.success("All images cleared");
    }
  };
  
  const handleDeleteImage = () => {
    setGeneratedImages(getGeneratedImages());
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="h-6 w-6 text-primary animate-pulse-subtle" />
              <h1 className="text-2xl font-bold tracking-tight">AI Image Generator</h1>
            </div>
            <p className="text-muted-foreground max-w-md">
              Create stunning images with DALL-E AI by describing what you want to see
            </p>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
                <TabsTrigger value="generate" className="flex items-center gap-1.5">
                  <SparklesIcon className="h-4 w-4" />
                  Generate
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4" />
                  Gallery {generatedImages.length > 0 && `(${generatedImages.length})`}
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1.5">
                  <SettingsIcon className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="generate" className="mt-0 animate-slide-up">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="glass rounded-xl p-6 border border-border/50 shadow-sm">
                    <PromptInput onSubmit={handleGenerate} isLoading={isGenerating} />
                  </div>
                  
                  {isGenerating ? (
                    <div className="glass rounded-xl overflow-hidden aspect-square flex flex-col items-center justify-center text-center p-8 animate-fade-in border border-border/50 shadow-sm">
                      <div className="relative w-32 h-32">
                        <div className="absolute inset-0 rounded-full border-t-primary border-4 border-muted animate-spin" />
                        <div className="absolute inset-4 rounded-full border-t-primary border-4 border-muted animate-spin" style={{ animationDuration: '3s' }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <SparklesIcon className="h-8 w-8 text-primary animate-pulse" />
                        </div>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">Creating your masterpiece</h3>
                      <p className="mt-2 text-sm text-muted-foreground max-w-md">
                        DALL-E is generating your image. This may take a few moments...
                      </p>
                    </div>
                  ) : generatedImages.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Most Recent Image</h2>
                      </div>
                      <ImageDisplay image={generatedImages[0]} onDelete={handleDeleteImage} />
                    </div>
                  ) : (
                    <EmptyState 
                      title="No images generated yet"
                      description="Enter a prompt and click 'Generate Image' to create your first AI image"
                      className="min-h-[400px]"
                    />
                  )}
                </div>
                
                <div className="lg:col-span-1">
                  <ImageSettings 
                    size={imageSize}
                    onSizeChange={(size) => setImageSize(size as ImageGenerationParams['size'])}
                    quality={imageQuality}
                    onQualityChange={(quality) => setImageQuality(quality as ImageGenerationParams['quality'])}
                    style={imageStyle}
                    onStyleChange={(style) => setImageStyle(style as ImageGenerationParams['style'])}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="gallery" className="mt-0 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Your Generated Images</h2>
                {generatedImages.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={handleClearImages}
                    className="text-destructive"
                  >
                    <Trash2Icon className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
              
              {generatedImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {generatedImages.map((image, index) => (
                    <ImageDisplay 
                      key={`${image.timestamp}-${index}`}
                      image={image} 
                      onDelete={handleDeleteImage}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  title="Your gallery is empty"
                  description="Generate some images to see them here in your gallery"
                  className="min-h-[400px]"
                />
              )}
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0 animate-slide-up">
              <div className="max-w-3xl mx-auto space-y-8">
                <section className="glass rounded-xl p-6 border border-border/50 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">API Settings</h2>
                  <Separator className="mb-6" />
                  <ApiKeyInput onApiKeyChange={setApiKey} />
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-medium mb-3">Need an API key?</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      To use this image generator, you need an OpenAI API key with access to DALL-E models.
                    </p>
                    <a 
                      href="https://platform.openai.com/api-keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={cn(
                        "text-sm text-primary hover:text-primary/80 transition-colors",
                        "inline-flex items-center"
                      )}
                    >
                      Get an API key from OpenAI
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </section>

                <section className="glass rounded-xl p-6 border border-border/50 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Image Generation Settings</h2>
                  <Separator className="mb-6" />
                  <ImageSettings 
                    size={imageSize}
                    onSizeChange={(size) => setImageSize(size as ImageGenerationParams['size'])}
                    quality={imageQuality}
                    onQualityChange={(quality) => setImageQuality(quality as ImageGenerationParams['quality'])}
                    style={imageStyle}
                    onStyleChange={(style) => setImageStyle(style as ImageGenerationParams['style'])}
                  />
                </section>
                
                <section className="glass rounded-xl p-6 border border-border/50 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Storage</h2>
                  <Separator className="mb-6" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Your generated images are stored locally in your browser's storage. They are not uploaded to any server.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleClearImages}
                    disabled={generatedImages.length === 0}
                  >
                    <Trash2Icon className="h-4 w-4 mr-2" />
                    Clear All Images
                  </Button>
                </section>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="w-full border-t border-border/40 bg-background/80 backdrop-blur-sm py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            AI Image Generator using DALL-E | Images are generated via OpenAI's API
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
