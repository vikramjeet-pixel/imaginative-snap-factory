
import { SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

const EmptyState = ({
  title,
  description,
  icon = <SparklesIcon className="h-12 w-12" />,
  className
}: EmptyStateProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8",
      "border border-dashed border-muted-foreground/25 rounded-lg",
      "bg-muted/30 animate-fade-in",
      className
    )}>
      <div className="rounded-full bg-primary/10 p-4 animate-pulse-subtle text-primary">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
