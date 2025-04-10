// Helper functions for the static renderer

import { clsx } from "clsx";

import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Deep clone an object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Safely get a nested property from an object
export function getNestedProperty(obj: any, path: string, defaultValue: any = undefined) {
  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current === undefined || current === null) {
      return defaultValue;
    }
    current = current[key];
  }

  return current === undefined ? defaultValue : current;
}

// Convert hex color to rgba
export function hexToRgba(hex: string, alpha = 1): string {
  if (!hex) return `rgba(0, 0, 0, ${alpha})`;

  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const formattedHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
  if (!result) return `rgba(0, 0, 0, ${alpha})`;

  const r = Number.parseInt(result[1], 16);
  const g = Number.parseInt(result[2], 16);
  const b = Number.parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Generate a unique ID
export function generateId(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
