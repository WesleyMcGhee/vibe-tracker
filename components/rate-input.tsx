"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RATE_OPTIONS = Array.from({ length: 20 }, (_, i) => (i + 1) * 2.5);
const CUSTOM = "custom";

function isPresetValue(value: string) {
  return RATE_OPTIONS.includes(Number(value));
}

export function RateInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [mode, setMode] = useState<"preset" | "custom">(isPresetValue(value) ? "preset" : "custom");

  useEffect(() => {
    setMode(isPresetValue(value) ? "preset" : "custom");
  }, [value]);

  return (
    <div className="space-y-1.5">
      <Label>Rate per Rider</Label>
      <Select
        value={mode === "custom" ? CUSTOM : value}
        onValueChange={(v) => {
          if (!v) return;
          if (v === CUSTOM) {
            setMode("custom");
          } else {
            onChange(v);
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {RATE_OPTIONS.map((r) => (
            <SelectItem key={r} value={r.toString()}>
              ${r.toFixed(2)} / rider
            </SelectItem>
          ))}
          <SelectItem value={CUSTOM}>Custom...</SelectItem>
        </SelectContent>
      </Select>
      {mode === "custom" && (
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="Enter custom rate"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
