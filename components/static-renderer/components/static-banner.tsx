"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  backgroundImage: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  showButton?: boolean;
  customContent?: string;
  alignment?: "left" | "center" | "right";
  verticalAlignment?: "top" | "middle" | "bottom";
}

interface BorderProps {
  width: number;
  style: "solid" | "dashed" | "dotted" | "none";
  color: string;
  radius: {
    topLeft: number;
    topRight: number;
    bottomRight: number;
    bottomLeft: number;
  };
}

interface AnimationValue {
  type: string;
  duration: number;
  delay: number;
  easing: string;
  repeat: number;
  framerEasing?: string;
}

interface BackgroundImageValue {
  url: string;
  size: string;
  position: string;
  repeat: string;
  customSize?: string;
  customPosition?: string;
}

interface BackgroundGradientColor {
  color: string;
  position: number;
}

interface BackgroundGradientValue {
  type: string;
  angle: number;
  colors: BackgroundGradientColor[];
}

interface BackgroundOverlayValue {
  enabled: boolean;
  color: string;
  opacity: number;
}

interface BackgroundValue {
  type: string;
  color: string;
  image: BackgroundImageValue;
  gradient: BackgroundGradientValue;
  overlay: BackgroundOverlayValue;
}

interface StaticBannerProps {
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
  border?: BorderProps;
  animation?: AnimationValue;
  background?: BackgroundValue;
  transitionEffect?: "fade" | "slide" | "zoom" | "none";
  transitionDuration?: number;
  enableParallax?: boolean;
  parallaxIntensity?: number;
  enableKenBurns?: boolean;
  enableAccessibility?: boolean;
  customClasses?: string;
  id?: string;
  style?: React.CSSProperties;
}

const defaultSlides: BannerSlide[] = [
  {
    id: "slide1",
    title: "Bem vindo ao hycloud",
    subtitle: "Sua nova intranet de um jeito diferente",
    buttonText: "Leia mais",
    buttonUrl: "#",
    backgroundImage:
      "https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    textColor: "#ffffff",
    buttonColor: "#ffffff",
    buttonTextColor: "#014973",
    showButton: true,
    alignment: "center",
    verticalAlignment: "middle",
  },
  {
    id: "slide2",
    title: "Transforme sua equipe",
    subtitle: "Colaboração e produtividade em um só lugar",
    buttonText: "Saiba mais",
    buttonUrl: "#",
    backgroundImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    textColor: "#ffffff",
    buttonColor: "#007acc",
    buttonTextColor: "#ffffff",
    showButton: true,
    alignment: "left",
    verticalAlignment: "middle",
  },
  {
    id: "slide3",
    title: "Recursos exclusivos",
    subtitle: "Descubra todas as possibilidades",
    buttonText: "Explorar",
    buttonUrl: "#",
    backgroundImage:
      "https://images.unsplash.com/photo-1515378791036-0648a814c963?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    textColor: "#ffffff",
    buttonColor: "#28a745",
    buttonTextColor: "#ffffff",
    showButton: true,
    alignment: "right",
    verticalAlignment: "middle",
  },
];

const defaultBorder: BorderProps = {
  width: 0,
  style: "solid",
  color: "#000000",
  radius: {
    topLeft: 20,
    topRight: 20,
    bottomRight: 20,
    bottomLeft: 20,
  },
};

const defaultAnimation: AnimationValue = {
  type: "none",
  duration: 500,
  delay: 0,
  easing: "linear",
  repeat: 0,
};

const defaultBackground: BackgroundValue = {
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
  slides = defaultSlides,
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
  id,
  style,
}: StaticBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Configurar autoplay para o carrossel
  useEffect(() => {
    if (isCarousel && autoPlay) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isCarousel, autoPlay, autoPlayInterval, slides.length]);

  // Efeito de parallax
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
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
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
    if (background?.type === "color") {
      return {
        backgroundColor: background.color,
        backgroundImage: "none",
        background: background.color,
      };
    } else if (background?.type === "image") {
      const imageUrl =
        background.image.url ||
        "https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      const overlayStyle = background.overlay.enabled
        ? `linear-gradient(rgba(${hexToRgb(background.overlay.color)}, ${background.overlay.opacity}), rgba(${hexToRgb(background.overlay.color)}, ${
            background.overlay.opacity
          }))`
        : "";

      return {
        backgroundImage: `${overlayStyle ? overlayStyle + ", " : ""}url(${imageUrl})`,
        backgroundSize: background.image.size === "custom" ? background.image.customSize : background.image.size,
        backgroundPosition: background.image.position === "custom" ? background.image.customPosition : background.image.position,
        backgroundRepeat: background.image.repeat,
        backgroundColor: "transparent",
      };
    } else if (background?.type === "gradient") {
      const gradientType =
        background.gradient.type === "linear"
          ? `linear-gradient(${background.gradient.angle}deg, ${background.gradient.colors.map((c) => `${c.color} ${c.position}%`).join(", ")})`
          : `radial-gradient(circle, ${background.gradient.colors.map((c) => `${c.color} ${c.position}%`).join(", ")})`;

      return {
        background: gradientType,
        backgroundColor: "transparent",
      };
    }

    // Fallback para o comportamento anterior
    if (backgroundImage) {
      return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, ${overlayOpacity}), rgba(0, 0, 0, ${overlayOpacity})), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "transparent",
      };
    }
    return {
      background: backgroundColor || "#014973",
      backgroundColor: backgroundColor || "#014973",
      backgroundImage: "none",
    };
  };

  // Função auxiliar para converter hex para rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}` : "0, 0, 0";
  };

  const marginStyle = {
    marginTop: `${margin?.top || 0}px`,
    marginRight: `${margin?.right || 0}px`,
    marginBottom: `${margin?.bottom || 0}px`,
    marginLeft: `${margin?.left || 0}px`,
  };

  const paddingStyle = {
    paddingTop: `${padding?.top || 0}px`,
    paddingRight: `${padding?.right || 0}px`,
    paddingBottom: `${padding?.bottom || 0}px`,
    paddingLeft: `${padding?.left || 0}px`,
  };

  const borderStyle = {
    borderWidth: border && border.width > 0 ? `${border.width}px` : "0",
    borderStyle: border?.style || "solid",
    borderColor: border?.color || "#000000",
    borderRadius: border?.radius
      ? `${border.radius.topLeft}px ${border.radius.topRight}px ${border.radius.bottomRight}px ${border.radius.bottomLeft}px`
      : "0px",
  };

  // Estilos para efeito de parallax
  const parallaxStyle = enableParallax
    ? {
        transform: `translate(${mousePosition.x * parallaxIntensity * -1}px, ${mousePosition.y * parallaxIntensity * -1}px)`,
        transition: "transform 0.1s ease-out",
      }
    : {};

  // Estilos para efeito Ken Burns
  const kenBurnsStyle = enableKenBurns
    ? {
        animation: "kenburns 20s ease-in-out infinite alternate",
      }
    : {};

  // Configurar animações com Framer Motion
  const getAnimationProps = () => {
    if (!animation || animation.type === "none") {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
      };
    }

    const baseAnimation = {
      initial: {},
      animate: {},
      transition: {
        duration: (animation?.duration || 500) / 1000,
        delay: (animation?.delay || 0) / 1000,
        ease: animation?.framerEasing || animation?.easing || "linear",
        repeat: animation?.repeat || 0,
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

  // Configurar transições de slides
  const getSlideTransition = () => {
    switch (transitionEffect) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: (transitionDuration || 500) / 1000 },
        };
      case "slide":
        return {
          initial: { x: 300, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -300, opacity: 0 },
          transition: { duration: (transitionDuration || 500) / 1000 },
        };
      case "zoom":
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.2, opacity: 0 },
          transition: { duration: (transitionDuration || 500) / 1000 },
        };
      default:
        return {
          transition: { duration: (transitionDuration || 500) / 1000 },
        };
    }
  };

  // Função para obter o estilo de fundo específico do slide
  const getSlideBackgroundStyle = (slide: BannerSlide) => {
    if (slide.backgroundImage) {
      const overlayStyle = background?.overlay?.enabled
        ? `linear-gradient(rgba(${hexToRgb(background.overlay.color)}, ${background.overlay.opacity}), rgba(${hexToRgb(background.overlay.color)}, ${
            background.overlay.opacity
          }))`
        : "";

      return {
        backgroundImage: `${overlayStyle ? overlayStyle + ", " : ""}url(${slide.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "transparent",
      };
    }

    // Fallback para o estilo de fundo padrão
    return getBackgroundStyle();
  };

  const getSlideTextAlignment = (slide: BannerSlide) => {
    const slideAlignment = slide.alignment || alignment;
    return {
      left: "text-left items-start",
      center: "text-center items-center",
      right: "text-right items-end",
    }[slideAlignment];
  };

  const getSlideVerticalAlignment = (slide: BannerSlide) => {
    const slideVerticalAlignment = slide.verticalAlignment || verticalAlignment;
    return {
      top: "justify-start",
      middle: "justify-center",
      bottom: "justify-end",
    }[slideVerticalAlignment];
  };

  const handleButtonClick = (url: string) => {
    if (url && url !== "#") {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="w-full" style={{ maxWidth: "100vw", boxSizing: "border-box" }}>
      <motion.div
        className={`static-banner ${customClasses}`}
        {...getAnimationProps()}
        style={{
          width: `calc(100% - ${margin?.left || 0}px - ${margin?.right || 0}px)`,
          margin: `${margin?.top || 0}px ${margin?.right || 0}px ${margin?.bottom || 0}px ${margin?.left || 0}px`,
          ...borderStyle,
          overflow: "hidden",
          ...(style || {}),
        }}
        id={id}
      >
        <div ref={containerRef} className="relative overflow-hidden" style={{ height: `${height}px` }}>
          {isCarousel ? (
            <div className="h-full">
              <AnimatePresence mode="wait">
                <motion.div key={currentSlide} className="absolute inset-0" {...getSlideTransition()}>
                  <div
                    className="w-full h-full"
                    style={{
                      ...getSlideBackgroundStyle(slides[currentSlide]),
                      ...kenBurnsStyle,
                    }}
                  >
                    <div
                      className={`w-full h-full flex flex-col ${getSlideVerticalAlignment(slides[currentSlide])} ${getSlideTextAlignment(
                        slides[currentSlide]
                      )}`}
                      style={{
                        ...paddingStyle,
                        ...parallaxStyle,
                      }}
                    >
                      <motion.h1 className="text-4xl font-bold mb-4" style={{ color: slides[currentSlide].textColor || textColor || "#ffffff" }}>
                        {slides[currentSlide].title}
                      </motion.h1>

                      <motion.p className="text-lg mb-6" style={{ color: slides[currentSlide].textColor || textColor || "#ffffff" }}>
                        {slides[currentSlide].subtitle}
                      </motion.p>

                      {(slides[currentSlide].showButton ?? showButton) && (
                        <div className="w-full">
                          <button
                            onClick={() => handleButtonClick(slides[currentSlide].buttonUrl)}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                            style={{
                              backgroundColor: slides[currentSlide].buttonColor || buttonColor,
                              color: slides[currentSlide].buttonTextColor || buttonTextColor,
                            }}
                          >
                            {slides[currentSlide].buttonText}
                          </button>
                        </div>
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
                    aria-label={enableAccessibility ? "Slide anterior" : undefined}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all z-10"
                    onClick={nextSlide}
                    aria-label={enableAccessibility ? "Próximo slide" : undefined}
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
                      aria-label={enableAccessibility ? `Ir para slide ${index + 1}` : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div
              className="w-full h-full"
              style={{
                ...getSlideBackgroundStyle(slides[0]),
                ...kenBurnsStyle,
              }}
            >
              <div
                className={`w-full h-full flex flex-col ${getSlideVerticalAlignment(slides[0])} ${getSlideTextAlignment(slides[0])}`}
                style={{
                  ...paddingStyle,
                  ...parallaxStyle,
                }}
              >
                <motion.h1 className="text-4xl font-bold mb-4" style={{ color: slides[0].textColor || textColor || "#ffffff" }}>
                  {title}
                </motion.h1>

                <motion.p className="text-lg mb-6" style={{ color: slides[0].textColor || textColor || "#ffffff" }}>
                  {subtitle}
                </motion.p>

                {(slides[0].showButton ?? showButton) && (
                  <div className="w-full">
                    <button
                      onClick={() => handleButtonClick(buttonUrl)}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{
                        backgroundColor: buttonColor,
                        color: buttonTextColor,
                      }}
                    >
                      {buttonText}
                    </button>
                  </div>
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
    </div>
  );
}
