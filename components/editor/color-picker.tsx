"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChromePicker } from "react-color";

interface ColorPickerProps {
  defaultColor: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ defaultColor, onChange }) => {
  const [color, setColor] = useState(defaultColor);
  const [isOpen, setIsOpen] = useState(false);
  const initialColorRef = useRef(defaultColor);

  useEffect(() => {
    if (defaultColor !== color) {
      setColor(defaultColor);
    }
  }, [defaultColor]);

  const handleColorChange = useCallback((colorResult: any) => {
    const newColor = colorResult.hex;
    setColor(newColor);
  }, []);

  const handleComplete = useCallback(
    (colorResult: any) => {
      const newColor = colorResult.hex;
      onChange(newColor);
    },
    [onChange]
  );

  const handleOpen = useCallback(
    (open: boolean) => {
      if (open) {
        initialColorRef.current = color;
      } else {
        // If color changed and popover is closing, make sure onChange is called
        if (initialColorRef.current !== color) {
          onChange(color);
        }
      }
      setIsOpen(open);
    },
    [color, onChange]
  );

  return (
    <Popover open={isOpen} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-full h-8 rounded-md border border-gray-300 flex items-center justify-between px-3 py-2"
          style={{ backgroundColor: color }}
        >
          <span
            className="text-xs font-medium"
            style={{
              color: isLightColor(color) ? "#000000" : "#ffffff",
              textShadow: "0px 0px 2px rgba(0,0,0,0.2)",
            }}
          >
            {color}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none" sideOffset={5}>
        <ChromePicker color={color} onChange={handleColorChange} onChangeComplete={handleComplete} disableAlpha />
      </PopoverContent>
    </Popover>
  );
};

// Helper function to determine if a color is light or dark
function isLightColor(color: string): boolean {
  // For transparent colors
  if (color === "transparent") return true;

  // Remove # if present
  const hex = color.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance (perceived brightness)
  // https://www.w3.org/TR/WCAG20-TECHS/G18.html
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5;
}
