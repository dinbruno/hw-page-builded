"use client";

import { useNode } from "@craftjs/core";
import { motion } from "framer-motion";

interface ProductCardProps {
  title: string;
  image: string;
  category: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

export const ProductCard = ({ title, image, category, description, linkText, linkUrl }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-blue-600 font-medium mb-1">{category}</span>
        <h3 className="font-medium text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-1">{description}</p>
        <a href={linkUrl} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
          {linkText}
        </a>
      </div>
    </div>
  );
};
