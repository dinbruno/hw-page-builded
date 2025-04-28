"use client";

import React from "react";
import { Label } from "@/components/ui/label";

interface PropertyFieldProps {
  label: string;
  children: React.ReactNode;
}

export const PropertyField: React.FC<PropertyFieldProps> = ({ label, children }) => {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">{label}</Label>
      <div>{children}</div>
    </div>
  );
};
