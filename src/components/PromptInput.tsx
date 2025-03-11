
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SparklesIcon, Loader2, InfoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const PromptInput = ({ onSubmit, isLoading }: PromptInputProps) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="prompt-input" className="text-sm font-medium">
          Describe your image
        </label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-xs text-muted-foreground hover:text-foreground cursor-help">
                <InfoIcon className="h-3.5 w-3.5 mr-1" />
                Prompt tips
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-4">
              <div className="space-y-2">
                <h4 className="font-medium">Tips for better results:</h4>
                <ul className="text-xs list-disc pl-4 space-y-1">
                  <li>Be specific and detailed in your description</li>
                  <li>Mention art style (e.g., watercolor, digital art, photography)</li>
                  <li>Include lighting details (e.g., soft lighting, sunset)</li>
                  <li>Specify perspective (e.g., close-up, aerial view)</li>
                  <li>Mention color schemes if important</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Textarea
        id="prompt-input"
        placeholder="Describe the image you want to generate in detail... (e.g., 'A serene mountain landscape at sunset with a lake reflection, in watercolor style')"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className={cn(
          "w-full resize-none transition-all overflow-hidden bg-background min-h-[100px]",
          "border border-input focus-visible:ring-1 focus-visible:ring-ring"
        )}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className="group"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating
            </>
          ) : (
            <>
              <SparklesIcon className="mr-2 h-4 w-4 group-hover:animate-pulse-subtle" />
              Generate Image
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default PromptInput;
