"use client";

import Input from "@/components/ui/input";

interface ColorPickerProps {
  defaultColor: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ defaultColor, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <Input type="color" value={defaultColor} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 p-1" />
      <Input type="text" value={defaultColor} onChange={(e) => onChange(e.target.value)} className="w-24" />
    </div>
  );
}
