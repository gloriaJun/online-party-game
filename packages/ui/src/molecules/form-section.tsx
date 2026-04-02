import { cn } from "../lib/utils";
import { Card, CardContent } from "../atoms/card";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="p-4">
        <div className="mb-4 text-center">
          <h3 className="leading-none font-semibold tracking-tight">{title}</h3>
          {description && (
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
