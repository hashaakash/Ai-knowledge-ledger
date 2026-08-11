import type { ReactNode } from "react";

interface SettingsRowProps {
  label: string;
  description?: string;
  /** Shown next to the label for settings that don't affect app behavior yet, so nothing here quietly pretends to work. */
  previewOnly?: boolean;
  children: ReactNode;
}

export function SettingsRow({ label, description, previewOnly, children }: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{label}</p>
          {previewOnly && (
            <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Preview only
            </span>
          )}
        </div>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}