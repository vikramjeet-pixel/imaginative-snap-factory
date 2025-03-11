
import { useState, useEffect } from 'react';
import { Download, Trash2, EyeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { GeneratedImage } from '@/services/openai';
import { deleteGeneratedImage } from '@/services/localStorage';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ImageDisplayProps {
  image: GeneratedImage;
  onDelete?: () => void;
}

const ImageDisplay = ({ image, onDelete }: ImageDisplayProps) => {
  const [loaded, setLoaded] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dalle-image-${new Date(image.timestamp).toISOString().slice(0, 10)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully');
    } catch (error) {
      toast.error('Failed to download image');
      console.error('Download error:', error);
    }
  };

  const handleDelete = () => {
    if (image.timestamp) {
      deleteGeneratedImage(image.timestamp);
      if (onDelete) onDelete();
      toast.success('Image deleted');
    }
  };

  const formattedDate = new Date(image.timestamp).toLocaleDateString(undefined, {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className="relative rounded-xl overflow-hidden bg-black/5 animate-fade-in border border-border/50 shadow-sm group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        )}
        <img
          src={image.url}
          alt={image.prompt}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            !loaded && "opacity-0",
            loaded && "opacity-100"
          )}
          onLoad={() => setLoaded(true)}
        />
        
        <Dialog>
          <DialogTrigger asChild>
            <button 
              className={cn(
                "absolute top-2 right-2 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white transition-opacity",
                showControls ? "opacity-100" : "opacity-0",
                "hover:bg-black/40"
              )}
            >
              <EyeIcon className="h-4 w-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-auto p-0 gap-0">
            <div className="p-6 bg-background">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black rounded-lg overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.prompt} 
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="flex flex-col space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Prompt</h3>
                    <p className="text-muted-foreground">{image.prompt}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Generated on</h3>
                    <p className="text-muted-foreground">{formattedDate}</p>
                  </div>
                  <div className="flex space-x-2 mt-auto">
                    <Button onClick={handleDownload} variant="outline" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button onClick={handleDelete} variant="destructive" className="flex-1">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="p-3">
        <p className="text-sm font-medium text-foreground truncate">{formattedDate}</p>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{image.prompt}</p>
      </div>
      
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 p-3 flex justify-between bg-gradient-to-t from-background/90 to-transparent",
          "transition-opacity duration-200",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <Button size="sm" variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" className="text-destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ImageDisplay;
