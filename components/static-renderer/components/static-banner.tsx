"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../ui/button";

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  backgroundImage: string;
  customContent?: string;
}

interface BannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  alignment?: "left" | "center" | "right";
  verticalAlignment?: "top" | "middle" | "bottom";
  height?: number;
  showButton?: boolean;
  isCarousel?: boolean;
  slides?: BannerSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
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
    type: string;
    duration: number;
    delay: number;
    easing: string;
    repeat: number;
  };
  background?: {
    type: string;
    color: string;
    image: {
      url: string;
      size: string;
      position: string;
      repeat: string;
      customSize?: string;
      customPosition?: string;
    };
    gradient: {
      type: string;
      angle: number;
      colors: Array<{ color: string; position: number }>;
    };
    overlay: {
      enabled: boolean;
      color: string;
      opacity: number;
    };
  };
  transitionEffect?: "fade" | "slide" | "zoom" | "none";
  transitionDuration?: number;
  enableParallax?: boolean;
  parallaxIntensity?: number;
  enableKenBurns?: boolean;
  enableAccessibility?: boolean;
  customClasses?: string;
}

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
  type: "none",
  duration: 500,
  delay: 0,
  easing: "ease",
  repeat: 0,
};

const defaultBackground = {
  type: "color",
  color: "#014973",
  image: {
    url: "",
    size: "cover",
    position: "center",
    repeat: "no-repeat",
  },
  gradient: {
    type: "linear",
    angle: 90,
    colors: [
      { color: "#014973", position: 0 },
      { color: "#0277bd", position: 100 },
    ],
  },
  overlay: {
    enabled: true,
    color: "#000000",
    opacity: 0.5,
  },
};

export default function StaticBanner({
  title = "Bem vindo ao hycloud",
  subtitle = "Sua nova intranet de um jeito diferente",
  buttonText = "Leia mais",
  buttonUrl = "#",
  backgroundColor = "#014973",
  textColor = "#ffffff",
  buttonColor = "#ffffff",
  buttonTextColor = "#014973",
  backgroundImage = "",
  overlayOpacity = 0.5,
  alignment = "center",
  verticalAlignment = "middle",
  height = 400,
  showButton = true,
  isCarousel = false,
  slides = [],
  autoPlay = true,
  autoPlayInterval = 5000,
  showIndicators = true,
  showArrows = true,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 20, right: 20, bottom: 20, left: 20 },
  hidden = false,
  border = defaultBorder,
  animation = defaultAnimation,
  background = defaultBackground,
  transitionEffect = "fade",
  transitionDuration = 500,
  enableParallax = false,
  parallaxIntensity = 20,
  enableKenBurns = false,
  enableAccessibility = true,
  customClasses = "",
}: BannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Configure autoplay for carousel
  useEffect(() => {
    if (isCarousel && autoPlay) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev === (slides?.length || 0) - 1 ? 0 : prev + 1));
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isCarousel, autoPlay, autoPlayInterval, slides?.length]);

  // Parallax effect
  useEffect(() => {
    if (enableParallax && containerRef.current) {
      const handleMouseMove = (e: MouseEvent) => {
        const { left, top, width, height } = containerRef.current!.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setMousePosition({ x, y });
      };

      containerRef.current.addEventListener("mousemove", handleMouseMove);
      return () => {
        containerRef.current?.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [enableParallax]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === (slides?.length || 0) - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? (slides?.length || 0) - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (hidden) return null;

  const textAlignmentClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[alignment];

  const verticalAlignmentClass = {
    top: "justify-start",
    middle: "justify-center",
    bottom: "justify-end",
  }[verticalAlignment];

  const getBackgroundStyle = () => {
    if (background.type === "color") {
      return { backgroundColor: background.color };
    } else if (background.type === "image" && background.image.url) {
      const overlayStyle = background.overlay.enabled
        ? `linear-gradient(rgba(${hexToRgb(background.overlay.color)}, ${background.overlay.opacity}), rgba(${hexToRgb(background.overlay.color)}, ${
            background.overlay.opacity
          }))`
        : "";

      return {
        backgroundImage: `${overlayStyle ? overlayStyle + ", " : ""}url(${background.image.url})`,
        backgroundSize: background.image.size === "custom" ? background.image.customSize : background.image.size,
        backgroundPosition: background.image.position === "custom" ? background.image.customPosition : background.image.position,
        backgroundRepeat: background.image.repeat,
      };
    } else if (background.type === "gradient") {
      const gradientType =
        background.gradient.type === "linear"
          ? `linear-gradient(${background.gradient.angle}deg, ${background.gradient.colors.map((c) => `${c.color} ${c.position}%`).join(", ")})`
          : `radial-gradient(circle, ${background.gradient.colors.map((c) => `${c.color} ${c.position}%`).join(", ")})`;

      return { backgroundImage: gradientType };
    }

    // Fallback to previous behavior
    if (backgroundImage) {
      return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, ${overlayOpacity}), rgba(0, 0, 0, ${overlayOpacity})), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return { backgroundColor };
  };

  // Helper function to convert hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}` : "0, 0, 0";
  };

  const marginStyle = {
    marginTop: `${margin.top}px`,
    marginRight: `${margin.right}px`,
    marginBottom: `${margin.bottom}px`,
    marginLeft: `${margin.left}px`,
  };

  const paddingStyle = {
    paddingTop: `${padding.top}px`,
    paddingRight: `${padding.right}px`,
    paddingBottom: `${padding.bottom}px`,
    paddingLeft: `${padding.left}px`,
  };

  const borderStyle = {
    borderWidth: border.width > 0 ? `${border.width}px` : 0,
    borderStyle: border.style,
    borderColor: border.color,
    borderRadius: `${border.radius.topLeft}px ${border.radius.topRight}px ${border.radius.bottomRight}px ${border.radius.bottomLeft}px`,
  };

  // Styles for parallax effect
  const parallaxStyle = enableParallax
    ? {
        transform: `translate(${mousePosition.x * parallaxIntensity * -1}px, ${mousePosition.y * parallaxIntensity * -1}px)`,
        transition: "transform 0.1s ease-out",
      }
    : {};

  // Styles for Ken Burns effect
  const kenBurnsStyle = enableKenBurns
    ? {
        animation: "kenburns 20s ease-in-out infinite alternate",
      }
    : {};

  // Configure animations with Framer Motion
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
        duration: animation.duration / 1000,
        delay: animation.delay / 1000,
        ease: animation.easing,
        repeat: animation.repeat,
        repeatType: "loop" as const,
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

  // Configure slide transitions
  const getSlideTransition = () => {
    switch (transitionEffect) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: transitionDuration / 1000 },
        };
      case "slide":
        return {
          initial: { x: 300, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -300, opacity: 0 },
          transition: { duration: transitionDuration / 1000 },
        };
      case "zoom":
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.2, opacity: 0 },
          transition: { duration: transitionDuration / 1000 },
        };
      default:
        return {
          transition: { duration: transitionDuration / 1000 },
        };
    }
  };

  return (
    <motion.div
      className={`relative ${customClasses}`}
      {...getAnimationProps()}
      style={{
        ...marginStyle,
        ...borderStyle,
        overflow: "hidden",
      }}
    >
      <div ref={containerRef} className="relative overflow-hidden" style={{ height: `${height}px` }}>
        {isCarousel && slides && slides.length > 0 ? (
          <div className="h-full">
            <AnimatePresence mode="wait">
              <motion.div key={currentSlide} className="absolute inset-0" {...getSlideTransition()}>
                <div
                  className={`w-full h-full ${enableKenBurns ? "ken-burns" : ""}`}
                  style={{
                    ...getBackgroundStyle(),
                    ...kenBurnsStyle,
                  }}
                >
                  <div
                    className={`w-full h-full flex flex-col ${verticalAlignmentClass} ${textAlignmentClass}`}
                    style={{
                      ...paddingStyle,
                      ...parallaxStyle,
                    }}
                  >
                    <motion.h1 className="text-4xl font-bold mb-4" style={{ color: textColor }}>
                      {slides[currentSlide].title}
                    </motion.h1>

                    <motion.p className="text-lg mb-6" style={{ color: textColor }}>
                      {slides[currentSlide].subtitle}
                    </motion.p>

                    {showButton && (
                      <Button
                        style={{
                          backgroundColor: buttonColor,
                          color: buttonTextColor,
                        }}
                        asChild
                      >
                        <a href={slides[currentSlide].buttonUrl}>{slides[currentSlide].buttonText}</a>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {showArrows && (
              <>
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all z-10"
                  onClick={prevSlide}
                  aria-label="Slide anterior"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all z-10"
                  onClick={nextSlide}
                  aria-label="Próximo slide"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {showIndicators && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? "bg-white" : "bg-white bg-opacity-50"}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Ir para slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`w-full h-full ${enableKenBurns ? "ken-burns" : ""}`}
            style={{
              ...getBackgroundStyle(),
              ...kenBurnsStyle,
            }}
          >
            <div
              className={`w-full h-full flex flex-col ${verticalAlignmentClass} ${textAlignmentClass}`}
              style={{
                ...paddingStyle,
                ...parallaxStyle,
              }}
            >
              <motion.h1 className="text-4xl font-bold mb-4" style={{ color: textColor }}>
                {title}
              </motion.h1>

              <motion.p className="text-lg mb-6" style={{ color: textColor }}>
                {subtitle}
              </motion.p>

              {showButton && (
                <Button
                  style={{
                    backgroundColor: buttonColor,
                    color: buttonTextColor,
                  }}
                  asChild
                >
                  <a href={buttonUrl}>{buttonText}</a>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Ken Burns animation styles */}
      {enableKenBurns && (
        <style jsx global>{`
          @keyframes kenburns {
            0% {
              transform: scale(1) translate(0px, 0px);
            }
            100% {
              transform: scale(1.1) translate(-10px, -10px);
            }
          }
          .ken-burns {
            animation: kenburns 20s ease-in-out infinite alternate;
          }
        `}</style>
      )}
    </motion.div>
  );
}
