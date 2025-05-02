"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "../../ui/button";

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
  // Common props
  alignment?: "left" | "center" | "right";
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
  hidden?: boolean;
  border?: {
    width: number;
    style: "solid" | "dashed" | "dotted" | "none";
    color: string;
    radius: {
      topLeft: number;
      topRight: number;
      bottomRight: number;
      bottomLeft: number;
    };
  };
  animation?: {
    type: "none" | "fade" | "slide" | "zoom" | "flip" | "bounce";
    duration: number;
    delay: number;
  };
  background?: {
    type: "color" | "gradient" | "image";
    color: string;
    gradientFrom?: string;
    gradientTo?: string;
    imageUrl?: string;
    overlay?: string;
    overlayOpacity?: number;
  };
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

// Default values for the common properties
const defaultBorder = {
  width: 0,
  style: "solid" as const,
  color: "#000000",
  radius: {
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0,
  },
};

const defaultAnimation = {
  type: "none" as const,
  duration: 0.5,
  delay: 0,
};

const defaultBackground = {
  type: "color" as const,
  color: "#ffffff",
  gradientFrom: "#ffffff",
  gradientTo: "#f3f4f6",
  imageUrl: "",
  overlay: "rgba(0,0,0,0)",
  overlayOpacity: 0,
};

// Simple Product Card Component
const StaticProductCard = ({ title, image, category, description, linkText, linkUrl }: Omit<Product, "id">) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden h-full">
      <div className="relative h-48 w-full">
        <Image src={image} alt={title} fill style={{ objectFit: "cover" }} />
      </div>
      <div className="p-4">
        <div className="text-xs font-semibold text-blue-500 mb-1">{category}</div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <a href={linkUrl} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
          {linkText}
        </a>
      </div>
    </div>
  );
};

export default function StaticProductCarousel({
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
  alignment = "left",
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 16, right: 16, bottom: 16, left: 16 },
  hidden = false,
  border = defaultBorder,
  animation = defaultAnimation,
  background = defaultBackground,
}: StaticProductCarouselProps) {
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
  }, [autoplay, autoplaySpeed, currentSlide]);

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

  // Generate style object from props
  const containerStyle: React.CSSProperties = {
    position: "relative",
    marginTop: `${margin.top}px`,
    marginRight: `${margin.right}px`,
    marginBottom: `${margin.bottom}px`,
    marginLeft: `${margin.left}px`,
    paddingTop: `${padding.top}px`,
    paddingRight: `${padding.right}px`,
    paddingBottom: `${padding.bottom}px`,
    paddingLeft: `${padding.left}px`,
  };

  // Apply background
  if (background.type === "color") {
    containerStyle.backgroundColor = background.color;
  } else if (background.type === "gradient" && background.gradientFrom && background.gradientTo) {
    containerStyle.backgroundImage = `linear-gradient(to right, ${background.gradientFrom}, ${background.gradientTo})`;
  } else if (background.type === "image" && background.imageUrl) {
    containerStyle.backgroundImage = `url(${background.imageUrl})`;
    containerStyle.backgroundSize = "cover";
    containerStyle.backgroundPosition = "center";
  } else {
    containerStyle.backgroundColor = backgroundColor;
  }

  // Apply text color
  containerStyle.color = textColor;

  // Apply border
  if (border.width > 0) {
    containerStyle.borderWidth = `${border.width}px`;
    containerStyle.borderStyle = border.style;
    containerStyle.borderColor = border.color;
  }

  // Apply border radius
  if (border.radius) {
    containerStyle.borderTopLeftRadius = `${border.radius.topLeft}px`;
    containerStyle.borderTopRightRadius = `${border.radius.topRight}px`;
    containerStyle.borderBottomRightRadius = `${border.radius.bottomRight}px`;
    containerStyle.borderBottomLeftRadius = `${border.radius.bottomLeft}px`;
  }

  // Add border to ensure border-radius works even when width is 0
  if (
    border.width === 0 &&
    (border.radius.topLeft > 0 || border.radius.topRight > 0 || border.radius.bottomLeft > 0 || border.radius.bottomRight > 0)
  ) {
    containerStyle.border = "0px solid transparent";
  }

  // Get animation props
  const getAnimationProps = () => {
    if (animation.type === "none") {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
      };
    }

    const baseAnimation = {
      initial: {},
      animate: {},
      transition: {
        duration: animation.duration,
        delay: animation.delay,
        ease: animation.type === "bounce" ? "backOut" : "easeOut",
      },
    };

    switch (animation.type) {
      case "fade":
        return {
          ...baseAnimation,
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
      case "slide":
        return {
          ...baseAnimation,
          initial: { x: -50, opacity: 0 },
          animate: { x: 0, opacity: 1 },
        };
      case "zoom":
        return {
          ...baseAnimation,
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
        };
      case "flip":
        return {
          ...baseAnimation,
          initial: { rotateY: 90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
        };
      case "bounce":
        return {
          ...baseAnimation,
          animate: { y: [0, -10, 0] },
          transition: {
            ...baseAnimation.transition,
            times: [0, 0.5, 1],
          },
        };
      default:
        return baseAnimation;
    }
  };

  // Add overlay if using image background with overlay
  const renderOverlay = () => {
    if (background.type === "image" && background.overlay && background.overlayOpacity) {
      return (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: background.overlay,
            opacity: background.overlayOpacity,
            zIndex: 0,
          }}
        />
      );
    }
    return null;
  };

  return (
    <motion.div className="w-full" style={containerStyle} {...getAnimationProps()}>
      {renderOverlay()}
      <div className="relative z-10 py-6">
        <div
          className="flex justify-between items-center mb-6"
          style={{
            justifyContent: alignment === "left" ? "space-between" : alignment === "center" ? "center" : "flex-end",
          }}
        >
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
          className="flex overflow-x-auto"
          style={{
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            "::-webkit-scrollbar": { display: "none" },
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 px-2" style={{ width: `${100 / slidesToShow}%` }}>
              <StaticProductCard
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
      </div>

      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </motion.div>
  );
}
