"use client";

import type React from "react";

import { useNode } from "@craftjs/core";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ProductCard } from "./product-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "../editor/color-picker";
import { Switch } from "@/components/ui/switch";
import { PropertyField } from "../editor/property-field";

interface Product {
  id: string;
  title: string;
  image: string;
  category: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

interface ProductCarouselProps {
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

export const ProductCarousel = ({
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
}: ProductCarouselProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle autoplay
  useEffect(() => {
    if (autoplay && !selected) {
      autoplayTimerRef.current = setInterval(() => {
        nextSlide();
      }, autoplaySpeed);
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, autoplaySpeed, currentSlide, products.length, selected]);

  // Reset autoplay when props change
  useEffect(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }

    if (autoplay && !selected) {
      autoplayTimerRef.current = setInterval(() => {
        nextSlide();
      }, autoplaySpeed);
    }
  }, [autoplay, autoplaySpeed, selected]);

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
    if (selected) return;

    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || selected) return;

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
    <motion.div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      className={`w-full py-6 ${selected ? "component-selected" : ""}`}
      style={{ backgroundColor, color: textColor }}
      onClick={(e) => {
        if (!selected) {
          e.stopPropagation();
        }
      }}
    >
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

export const ProductCarouselSettings = () => {
  const {
    actions: { setProp },
    title,
    backgroundColor,
    textColor,
    titleSize,
    slidesToShow,
    autoplay,
    autoplaySpeed,
    showArrows,
    arrowColor,
    arrowBgColor,
    products,
  } = useNode((node) => ({
    title: node.data.props.title,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    titleSize: node.data.props.titleSize,
    slidesToShow: node.data.props.slidesToShow,
    autoplay: node.data.props.autoplay,
    autoplaySpeed: node.data.props.autoplaySpeed,
    showArrows: node.data.props.showArrows,
    arrowColor: node.data.props.arrowColor,
    arrowBgColor: node.data.props.arrowBgColor,
    products: node.data.props.products,
  }));

  // Evitar problemas de propagação de eventos
  const handlePreventPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const addProduct = () => {
    const newId = `product-${Date.now()}`;
    setProp((props: ProductCarouselProps) => ({
      products: [
        ...props.products!,
        {
          id: newId,
          title: "Novo Produto",
          image:
            "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          category: "Categoria",
          description: "Descrição do novo produto",
          linkText: "Leia mais",
          linkUrl: "#",
        },
      ],
    }));
  };

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProp((props: ProductCarouselProps) => ({
        products: props.products!.filter((product) => product.id !== id),
      }));
    }
  };

  const updateProduct = (id: string, field: keyof Product, value: string) => {
    setProp((props: ProductCarouselProps) => ({
      products: props.products!.map((product) => {
        if (product.id === id) {
          return { ...product, [field]: value };
        }
        return product;
      }),
    }));
  };

  return (
    <div onClick={handlePreventPropagation}>
      <Accordion type="multiple" defaultValue={["geral"]} className="w-full">
        <AccordionItem value="geral">
          <AccordionTrigger className="text-sm font-medium">Configurações Gerais</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <PropertyField label="Título">
              <Input value={title} onChange={(e) => setProp((props: ProductCarouselProps) => (props.title = e.target.value))} />
            </PropertyField>

            <PropertyField label="Tamanho do Título (px)">
              <Input
                type="number"
                value={titleSize}
                onChange={(e) => setProp((props: ProductCarouselProps) => (props.titleSize = Number.parseInt(e.target.value)))}
              />
            </PropertyField>

            <PropertyField label="Slides Visíveis">
              <Input
                type="number"
                min="1"
                max="4"
                value={slidesToShow}
                onChange={(e) => setProp((props: ProductCarouselProps) => (props.slidesToShow = Number.parseInt(e.target.value)))}
              />
            </PropertyField>

            <PropertyField label="Reprodução Automática">
              <div className="flex items-center">
                <Switch checked={autoplay} onCheckedChange={(checked) => setProp((props: ProductCarouselProps) => (props.autoplay = checked))} />
                <span className="ml-2">{autoplay ? "Sim" : "Não"}</span>
              </div>
            </PropertyField>

            {autoplay && (
              <PropertyField label="Velocidade (ms)">
                <Input
                  type="number"
                  min="1000"
                  step="500"
                  value={autoplaySpeed}
                  onChange={(e) => setProp((props: ProductCarouselProps) => (props.autoplaySpeed = Number.parseInt(e.target.value)))}
                />
              </PropertyField>
            )}

            <PropertyField label="Mostrar Setas de Navegação">
              <div className="flex items-center">
                <Switch checked={showArrows} onCheckedChange={(checked) => setProp((props: ProductCarouselProps) => (props.showArrows = checked))} />
                <span className="ml-2">{showArrows ? "Sim" : "Não"}</span>
              </div>
            </PropertyField>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="produtos">
          <AccordionTrigger className="text-sm font-medium">Produtos</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button onClick={addProduct} size="sm" className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-1" />
                Adicionar Produto
              </Button>
            </div>

            <Accordion type="single" collapsible>
              {products.map((product: Product) => (
                <AccordionItem key={product.id} value={product.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex justify-between items-center w-full pr-4">
                      <span>{product.title}</span>
                      {products.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeProduct(product.id);
                          }}
                          className="bg-red-50 text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      <PropertyField label="Título">
                        <Input value={product.title} onChange={(e) => updateProduct(product.id, "title", e.target.value)} />
                      </PropertyField>

                      <PropertyField label="Imagem URL">
                        <Input value={product.image} onChange={(e) => updateProduct(product.id, "image", e.target.value)} />
                      </PropertyField>

                      <PropertyField label="Categoria">
                        <Input value={product.category} onChange={(e) => updateProduct(product.id, "category", e.target.value)} />
                      </PropertyField>

                      <PropertyField label="Descrição">
                        <Input value={product.description} onChange={(e) => updateProduct(product.id, "description", e.target.value)} />
                      </PropertyField>

                      <PropertyField label="Texto do Link">
                        <Input value={product.linkText} onChange={(e) => updateProduct(product.id, "linkText", e.target.value)} />
                      </PropertyField>

                      <PropertyField label="URL do Link">
                        <Input value={product.linkUrl} onChange={(e) => updateProduct(product.id, "linkUrl", e.target.value)} />
                      </PropertyField>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="estilo">
          <AccordionTrigger className="text-sm font-medium">Estilo</AccordionTrigger>
          <AccordionContent className="space-y-4">
            {showArrows && (
              <>
                <PropertyField label="Cor das Setas">
                  <ColorPicker defaultColor={arrowColor} onChange={(color) => setProp((props: ProductCarouselProps) => (props.arrowColor = color))} />
                </PropertyField>

                <PropertyField label="Cor de Fundo das Setas">
                  <ColorPicker
                    defaultColor={arrowBgColor}
                    onChange={(color) => setProp((props: ProductCarouselProps) => (props.arrowBgColor = color))}
                  />
                </PropertyField>
              </>
            )}

            <PropertyField label="Cor de Fundo">
              <ColorPicker
                defaultColor={backgroundColor}
                onChange={(color) => setProp((props: ProductCarouselProps) => (props.backgroundColor = color))}
              />
            </PropertyField>

            <PropertyField label="Cor do Texto">
              <ColorPicker defaultColor={textColor} onChange={(color) => setProp((props: ProductCarouselProps) => (props.textColor = color))} />
            </PropertyField>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

ProductCarousel.craft = {
  displayName: "Carrossel de Produtos",
  props: {
    title: "Outros Produtos",
    products: defaultProducts,
    backgroundColor: "#ffffff",
    textColor: "#1f272f",
    titleSize: 24,
    slidesToShow: 3,
    autoplay: false,
    autoplaySpeed: 3000,
    showArrows: true,
    arrowColor: "#1f272f",
    arrowBgColor: "#f3f4f6",
    hidden: false,
  },
  related: {
    settings: ProductCarouselSettings,
  },
};
