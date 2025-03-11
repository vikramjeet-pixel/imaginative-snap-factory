
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface ImageSettingsProps {
  size: string;
  onSizeChange: (size: string) => void;
  quality: string;
  onQualityChange: (quality: string) => void;
  style: string;
  onStyleChange: (style: string) => void;
}

const ImageSettings = ({
  size,
  onSizeChange,
  quality,
  onQualityChange,
  style,
  onStyleChange
}: ImageSettingsProps) => {
  return (
    <div className="space-y-6 p-6 pb-4 bg-muted/30 backdrop-blur-sm rounded-xl border border-border/50">
      <div>
        <h3 className="text-lg font-medium">Image Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure options for your generated images
        </p>
      </div>
      <Separator />
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="size">Image Size</Label>
          <Select value={size} onValueChange={onSizeChange}>
            <SelectTrigger id="size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="256x256">Small (256×256)</SelectItem>
              <SelectItem value="512x512">Medium (512×512)</SelectItem>
              <SelectItem value="1024x1024">Large (1024×1024)</SelectItem>
              <SelectItem value="1792x1024">Wide (1792×1024)</SelectItem>
              <SelectItem value="1024x1792">Tall (1024×1792)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Larger sizes require more tokens and may take longer to generate.
          </p>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="quality">Quality</Label>
          <Select value={quality} onValueChange={onQualityChange}>
            <SelectTrigger id="quality">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="hd">HD</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            HD quality creates more detailed images but uses more tokens.
          </p>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="style">Style</Label>
          <Select value={style} onValueChange={onStyleChange}>
            <SelectTrigger id="style">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vivid">Vivid</SelectItem>
              <SelectItem value="natural">Natural</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Vivid produces hyper-realistic and dramatic images, while Natural creates more subtle images.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageSettings;
