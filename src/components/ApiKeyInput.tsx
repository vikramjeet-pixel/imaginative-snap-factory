
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, KeyRound } from 'lucide-react';
import { getApiKey, saveApiKey } from '@/services/localStorage';
import { toast } from 'sonner';

interface ApiKeyInputProps {
  onApiKeyChange: (key: string) => void;
}

const ApiKeyInput = ({ onApiKeyChange }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  
  useEffect(() => {
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      onApiKeyChange(savedKey);
    }
  }, [onApiKeyChange]);
  
  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    saveApiKey(apiKey);
    onApiKeyChange(apiKey);
    toast.success('API key saved successfully');
  };
  
  return (
    <div className="flex flex-col space-y-2 w-full">
      <Label htmlFor="api-key" className="flex items-center gap-1.5 text-sm font-medium">
        <KeyRound className="h-4 w-4" />
        OpenAI API Key
      </Label>
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Input
            id="api-key"
            type={showApiKey ? 'text' : 'password'}
            placeholder="Enter your OpenAI API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showApiKey ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
        <Button variant="secondary" onClick={handleSaveKey}>
          Save
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Your API key is stored locally in your browser and never sent to our servers.
      </p>
    </div>
  );
};

export default ApiKeyInput;
