"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "../../../components/user-components/product-card";

interface Product {
  id: string;
  title: string;
  image: string;
  category: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

interface StaticProductCarouselProps {
  title?: string;
  products?: Product[];
  backgroundColor?: string;
  textColor?: string;
  titleSize?: number;
  slidesToShow?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  showArrows?: boolean;
  arrowColor?: string;
  arrowBgColor?: string;
  hidden?: boolean;
}

const defaultProducts: Product[] = [
  {
    id: "1",
    title: "Notebook Samsung",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Equipamento",
    description: "Notebook Samsung usado que estou vendendo é uma excelente oportunidade",
    linkText: "Leia mais",
    linkUrl: "#",
  },
  {
    id: "2",
    title: "Tênis Air Max",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Pessoal",
    description: "Estou vendendo um Air Max novinho, nunca usado",
    linkText: "Leia mais",
    linkUrl: "#",
  },
  {
    id: "3",
    title: "iPhone 15",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Equipamento",
    description: "Vendendo um iPhone 15 com 1 ano de uso e está completinho na caixa",
    linkText: "Leia mais",
    linkUrl: "#",
  },
];

export const StaticProductCarousel: React.FC<StaticProductCarouselProps> = ({
  title = "Outros Produtos",
  products = defaultProducts,
  backgroundColor = "#ffffff",
  textColor = "#1f272f",
  titleSize = 24,
  slidesToShow = 3,
  autoplay = false,
  autoplaySpeed = 3000,
  showArrows = true,
  arrowColor = "#1f272f",
  arrowBgColor = "#f3f4f6",
  hidden = false,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayTimerRef.current = setInterval(() => {
        nextSlide();
      }, autoplaySpeed);
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, autoplaySpeed, currentSlide, products.length]);

  // Reset autoplay when props change
  useEffect(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }

    if (autoplay) {
      autoplayTimerRef.current = setInterval(() => {
        nextSlide();
      }, autoplaySpeed);
    }
  }, [autoplay, autoplaySpeed]);

  const nextSlide = () => {
    if (carouselRef.current) {
      const maxSlide = Math.max(0, products.length - slidesToShow);
      const nextSlideIndex = currentSlide >= maxSlide ? 0 : currentSlide + 1;
      setCurrentSlide(nextSlideIndex);

      const slideWidth = carouselRef.current.offsetWidth / slidesToShow;
      carouselRef.current.scrollTo({
        left: nextSlideIndex * slideWidth,
        behavior: "smooth",
      });
    }
  };

  const prevSlide = () => {
    if (carouselRef.current) {
      const maxSlide = Math.max(0, products.length - slidesToShow);
      const prevSlideIndex = currentSlide <= 0 ? maxSlide : currentSlide - 1;
      setCurrentSlide(prevSlideIndex);

      const slideWidth = carouselRef.current.offsetWidth / slidesToShow;
      carouselRef.current.scrollTo({
        left: prevSlideIndex * slideWidth,
        behavior: "smooth",
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  if (hidden) return null;

  return (
    <motion.div className="w-full py-6" style={{ backgroundColor, color: textColor }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold" style={{ fontSize: `${titleSize}px` }}>
          {title}
        </h2>

        {showArrows && (
          <div className="flex space-x-2">
            <button onClick={prevSlide} className="p-2 rounded-full" style={{ backgroundColor: arrowBgColor, color: arrowColor }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} className="p-2 rounded-full" style={{ backgroundColor: arrowBgColor, color: arrowColor }}>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide"
        style={{
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 px-2" style={{ width: `${100 / slidesToShow}%` }}>
            <ProductCard
              title={product.title}
              image={product.image}
              category={product.category}
              description={product.description}
              linkText={product.linkText}
              linkUrl={product.linkUrl}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};
