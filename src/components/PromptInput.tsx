
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SparklesIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <Textarea
        placeholder="Describe the image you want to generate..."
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
