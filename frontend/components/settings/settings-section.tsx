import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      <Card className="mt-3 divide-y">{children}</Card>
    </div>
  );
}