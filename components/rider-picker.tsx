"use client";

import { cn } from "@/lib/utils";

interface RiderPickerProps {
  value: number;
  onChange: (value: number) => void;
}

export function RiderPicker({ value, onChange }: RiderPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5 p-1">
      {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={cn(
            "h-9 w-9 rounded-md text-sm font-medium transition-colors border",
            value === n
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background hover:bg-accent hover:text-accent-foreground border-input"
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
