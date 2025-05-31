"use client";

import React from "react";
import { motion } from "framer-motion";
import { Facebook, Github, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";

// Interfaces para os tipos de dados
interface FooterLink {
  id: string;
  text: string;
  url: string;
  type?: string;
}

interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  id: string;
  type: "facebook" | "twitter" | "instagram" | "linkedin" | "youtube" | "github";
  url: string;
}

interface ContactInfo {
  address?: string;
  phone?: string;
  email?: string;
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

interface StaticFooterProps {
  layout?: "simple" | "columns" | "centered" | "modern" | "compact";
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  logoUrl?: string;
  logoText?: string;
  showLogo?: boolean;
  companyName?: string;
  companyDescription?: string;
  copyrightText?: string;
  showCopyright?: boolean;
  columns?: FooterColumn[];
  socialLinks?: SocialLink[];
  showSocialLinks?: boolean;
  contactInfo?: ContactInfo;
  showContactInfo?: boolean;
  showNewsletter?: boolean;
  newsletterTitle?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
  hidden?: boolean;
  border?: BorderProps;
  animation?: AnimationValue;
  background?: BackgroundValue;
  enableAccessibility?: boolean;
  customClasses?: string;
  id?: string;
  style?: React.CSSProperties;
}

// Valores padrão
const defaultColumns: FooterColumn[] = [
  {
    id: "col1",
    title: "Empresa",
    links: [
      { id: "link1", text: "Sobre nós", url: "#" },
      { id: "link2", text: "Nossos serviços", url: "#" },
      { id: "link3", text: "Política de privacidade", url: "#" },
    ],
  },
  {
    id: "col2",
    title: "Suporte",
    links: [
      { id: "link4", text: "FAQ", url: "#" },
      { id: "link5", text: "Central de ajuda", url: "#" },
      { id: "link6", text: "Contato", url: "#" },
    ],
  },
  {
    id: "col3",
    title: "Links úteis",
    links: [
      { id: "link7", text: "Blog", url: "#" },
      { id: "link8", text: "Carreiras", url: "#" },
      { id: "link9", text: "Parceiros", url: "#" },
    ],
  },
];

const defaultSocialLinks: SocialLink[] = [
  { id: "social1", type: "facebook", url: "#" },
  { id: "social2", type: "twitter", url: "#" },
  { id: "social3", type: "instagram", url: "#" },
  { id: "social4", type: "linkedin", url: "#" },
];

const defaultContactInfo: ContactInfo = {
  address: "Av. Paulista, 1000, São Paulo - SP",
  phone: "+55 (11) 1234-5678",
  email: "contato@hywork.com",
};

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
  type: "gradient",
  color: "#1f2937",
  image: {
    url: "",
    size: "cover",
    position: "center",
    repeat: "no-repeat",
  },
  gradient: {
    type: "linear",
    angle: 135,
    colors: [
      { color: "#1f2937", position: 0 },
      { color: "#111827", position: 100 },
    ],
  },
  overlay: {
    enabled: false,
    color: "#000000",
    opacity: 0.3,
  },
};

export default function StaticFooter({
  layout = "columns",
  backgroundColor = "#1f2937",
  textColor = "#ffffff",
  accentColor = "#3b82f6",
  logoUrl = "",
  logoText = "HyWork",
  showLogo = true,
  companyName = "HyWork Cloud",
  companyDescription = "Transformando a comunicação interna da sua empresa com soluções inovadoras e personalizadas.",
  copyrightText = "© 2023 HyWork Cloud. Todos os direitos reservados.",
  showCopyright = true,
  columns = defaultColumns,
  socialLinks = defaultSocialLinks,
  showSocialLinks = true,
  contactInfo = defaultContactInfo,
  showContactInfo = true,
  showNewsletter = true,
  newsletterTitle = "Inscreva-se na nossa newsletter",
  newsletterPlaceholder = "Seu e-mail",
  newsletterButtonText = "Inscrever",
  margin = { top: 10, right: 10, bottom: 10, left: 10 },
  padding = { top: 40, right: 20, bottom: 40, left: 20 },
  hidden = false,
  border = defaultBorder,
  animation = defaultAnimation,
  background = defaultBackground,
  enableAccessibility = true,
  customClasses = "",
  id,
  style,
}: StaticFooterProps) {
  if (hidden) return null;

  // Função auxiliar para converter hex para rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}` : "0, 0, 0";
  };

  const getBackgroundStyle = () => {
    if (background?.type === "color") {
      return { backgroundColor: background.color || backgroundColor };
    } else if (background?.type === "image" && background.image?.url) {
      const overlayStyle = background.overlay?.enabled
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
    } else if (background?.type === "gradient" && background.gradient) {
      const gradientType =
        background.gradient.type === "linear"
          ? `linear-gradient(${background.gradient.angle}deg, ${background.gradient.colors.map((c) => `${c.color} ${c.position}%`).join(", ")})`
          : `radial-gradient(circle, ${background.gradient.colors.map((c) => `${c.color} ${c.position}%`).join(", ")})`;

      return { backgroundImage: gradientType };
    }

    return { backgroundColor };
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
        ease: animation?.easing || "linear",
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
          initial: { y: 50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
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
          initial: { rotateX: 90, opacity: 0 },
          animate: { rotateX: 0, opacity: 1 },
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

  // Renderizar o ícone social correto
  const renderSocialIcon = (type: string) => {
    switch (type) {
      case "facebook":
        return <Facebook size={20} className="mx-2" />;
      case "twitter":
        return <Twitter size={20} className="mx-2" />;
      case "instagram":
        return <Instagram size={20} className="mx-2" />;
      case "linkedin":
        return <Linkedin size={20} className="mx-2" />;
      case "youtube":
        return <Youtube size={20} className="mx-2" />;
      case "github":
        return <Github size={20} className="mx-2" />;
      default:
        return <Facebook size={20} className="mx-2" />;
    }
  };

  // Renderizar o layout do footer com base no tipo selecionado
  const renderFooterLayout = () => {
    switch (layout) {
      case "simple":
        return renderSimpleFooter();
      case "columns":
        return renderColumnsFooter();
      case "centered":
        return renderCenteredFooter();
      case "modern":
        return renderModernFooter();
      case "compact":
        return renderCompactFooter();
      default:
        return renderColumnsFooter();
    }
  };

  // Layout Simples
  const renderSimpleFooter = () => {
    return (
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-6">
          <div className="mb-4 md:mb-0">
            {showLogo && (
              <div className="flex items-center">
                {logoUrl ? (
                  <img src={logoUrl || "/placeholder.svg"} alt={companyName} className="h-8 w-auto mr-2" />
                ) : (
                  <div className="font-bold text-xl mr-2" style={{ color: accentColor }}>
                    {logoText}
                  </div>
                )}
              </div>
            )}
          </div>

          {showSocialLinks && (
            <div className="flex space-x-2 mt-3">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  className="hover:opacity-80 transition-opacity mx-1"
                  style={{ color: accentColor }}
                  aria-label={enableAccessibility ? `Visite nosso ${link.type}` : undefined}
                >
                  {renderSocialIcon(link.type)}
                </a>
              ))}
            </div>
          )}
        </div>

        {showCopyright && (
          <div className="border-t py-4 text-sm text-center" style={{ borderColor: `rgba(${hexToRgb(textColor)}, 0.1)` }}>
            <p style={{ color: textColor }}>{copyrightText}</p>
          </div>
        )}
      </div>
    );
  };

  // Layout com Colunas
  const renderColumnsFooter = () => {
    return (
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
          <div className="col-span-1">
            {showLogo && (
              <div className="flex items-center mb-4">
                {logoUrl ? (
                  <img src={logoUrl || "/placeholder.svg"} alt={companyName} className="h-8 w-auto mr-2" />
                ) : (
                  <div className="font-bold text-xl mr-2" style={{ color: accentColor }}>
                    {logoText}
                  </div>
                )}
              </div>
            )}

            <div className="mb-4">
              <p className="text-sm opacity-80" style={{ color: textColor }}>
                {companyDescription}
              </p>
            </div>

            {showSocialLinks && (
              <div className="flex space-x-2 mt-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    className="hover:opacity-80 transition-opacity mx-1"
                    style={{ color: accentColor }}
                    aria-label={enableAccessibility ? `Visite nosso ${link.type}` : undefined}
                  >
                    {renderSocialIcon(link.type)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {columns.map((column) => (
            <div key={column.id} className="col-span-1">
              {column.links && column.links.length > 0 && (
                <>
                  <h3 className="font-semibold text-lg mb-4" style={{ color: textColor }}>
                    {column.title}
                  </h3>
                  <ul className="space-y-2">
                    {column.links.map((link) => (
                      <li key={link.id}>
                        <a
                          href={link.url}
                          className="hover:underline transition-all"
                          style={{ color: textColor, opacity: 0.8 }}
                          onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                          onMouseOut={(e) => (e.currentTarget.style.opacity = "0.8")}
                        >
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>

        {showCopyright && (
          <div className="border-t py-4 text-sm" style={{ borderColor: `rgba(${hexToRgb(textColor)}, 0.1)` }}>
            <p style={{ color: textColor }}>{copyrightText}</p>
          </div>
        )}
      </div>
    );
  };

  // Layout Centralizado
  const renderCenteredFooter = () => {
    // Filtrar apenas colunas com links para exibição
    const validLinks = columns.flatMap((column) => (column.links && column.links.length > 0 ? column.links : []));

    return (
      <div className="container mx-auto px-4 text-center">
        <div className="py-8">
          {showLogo && (
            <div className="flex justify-center items-center mb-6">
              {logoUrl ? (
                <img src={logoUrl || "/placeholder.svg"} alt={companyName} className="h-12 w-auto" />
              ) : (
                <div className="font-bold text-2xl" style={{ color: accentColor }}>
                  {logoText}
                </div>
              )}
            </div>
          )}

          {validLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {validLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  className="hover:underline transition-all"
                  style={{ color: textColor, opacity: 0.8 }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = "0.8")}
                >
                  {link.text}
                </a>
              ))}
            </div>
          )}

          {showSocialLinks && (
            <div className="flex justify-center space-x-2 my-8 py-2">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  className="hover:opacity-80 transition-opacity mx-1"
                  style={{ color: accentColor }}
                  aria-label={enableAccessibility ? `Visite nosso ${link.type}` : undefined}
                >
                  {renderSocialIcon(link.type)}
                </a>
              ))}
            </div>
          )}

          {showCopyright && (
            <div className="text-sm opacity-80">
              <p style={{ color: textColor }}>{copyrightText}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Layout Moderno
  const renderModernFooter = () => {
    return (
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
          <div className="col-span-1 md:col-span-4">
            {showLogo && (
              <div className="flex items-center mb-4">
                {logoUrl ? (
                  <img src={logoUrl || "/placeholder.svg"} alt={companyName} className="h-10 w-auto mr-2" />
                ) : (
                  <div className="font-bold text-2xl mr-2" style={{ color: accentColor }}>
                    {logoText}
                  </div>
                )}
              </div>
            )}

            <div className="mb-6">
              <p className="text-sm opacity-80" style={{ color: textColor }}>
                {companyDescription}
              </p>
            </div>

            {showContactInfo && contactInfo && (
              <div className="space-y-2 mb-6">
                {contactInfo.address && (
                  <div className="flex items-start">
                    <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" style={{ color: accentColor }} />
                    <span className="text-sm" style={{ color: textColor }}>
                      {contactInfo.address}
                    </span>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="flex items-center">
                    <Phone size={18} className="mr-2 flex-shrink-0" style={{ color: accentColor }} />
                    <span className="text-sm" style={{ color: textColor }}>
                      {contactInfo.phone}
                    </span>
                  </div>
                )}
                {contactInfo.email && (
                  <div className="flex items-center">
                    <Mail size={18} className="mr-2 flex-shrink-0" style={{ color: accentColor }} />
                    <span className="text-sm" style={{ color: textColor }}>
                      {contactInfo.email}
                    </span>
                  </div>
                )}
              </div>
            )}

            {showSocialLinks && (
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    className="hover:opacity-80 transition-opacity"
                    style={{ color: accentColor }}
                    aria-label={enableAccessibility ? `Visite nosso ${link.type}` : undefined}
                  >
                    {renderSocialIcon(link.type)}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-1 md:col-span-5">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {columns.map((column) => (
                <div key={column.id}>
                  {column.links && column.links.length > 0 && (
                    <>
                      <h3 className="font-semibold text-lg mb-4" style={{ color: textColor }}>
                        {column.title}
                      </h3>
                      <ul className="space-y-2">
                        {column.links.map((link) => (
                          <li key={link.id}>
                            <a
                              href={link.url}
                              className="hover:underline transition-all text-sm"
                              style={{ color: textColor, opacity: 0.8 }}
                              onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                              onMouseOut={(e) => (e.currentTarget.style.opacity = "0.8")}
                            >
                              {link.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-3">
            {showNewsletter && (
              <div className="bg-opacity-10 p-4 rounded-lg" style={{ backgroundColor: `rgba(${hexToRgb(textColor)}, 0.05)` }}>
                <h3 className="font-semibold text-lg mb-4" style={{ color: textColor }}>
                  {newsletterTitle}
                </h3>
                <div className="flex flex-col space-y-3">
                  <input
                    type="email"
                    placeholder={newsletterPlaceholder}
                    className="bg-opacity-10 border-opacity-20 p-2 rounded-md border outline-none"
                    style={{
                      backgroundColor: `rgba(${hexToRgb(textColor)}, 0.05)`,
                      borderColor: `rgba(${hexToRgb(textColor)}, 0.2)`,
                      color: textColor,
                    }}
                  />
                  <button
                    className="py-2 px-4 rounded-md transition-opacity hover:opacity-90 focus:outline-none"
                    style={{
                      backgroundColor: accentColor,
                      color: "#ffffff",
                    }}
                  >
                    {newsletterButtonText}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {showCopyright && (
          <div className="border-t py-4 text-sm" style={{ borderColor: `rgba(${hexToRgb(textColor)}, 0.1)` }}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p style={{ color: textColor }}>{copyrightText}</p>

              {showSocialLinks && (
                <div className="flex space-x-4 md:hidden mt-4 md:mt-0">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      className="hover:opacity-80 transition-opacity"
                      style={{ color: accentColor }}
                      aria-label={enableAccessibility ? `Visite nosso ${link.type}` : undefined}
                    >
                      {renderSocialIcon(link.type)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Layout Compacto
  const renderCompactFooter = () => {
    // Filtrar apenas colunas com links para exibição
    const validLinks = columns.flatMap((column) => (column.links && column.links.length > 0 ? column.links : []));

    return (
      <div className="container mx-auto px-4">
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            {showLogo && (
              <div className="flex items-center mb-4 md:mb-0">
                {logoUrl ? (
                  <img src={logoUrl || "/placeholder.svg"} alt={companyName} className="h-8 w-auto mr-2" />
                ) : (
                  <div className="font-bold text-xl mr-2" style={{ color: accentColor }}>
                    {logoText}
                  </div>
                )}
              </div>
            )}

            {validLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
                {validLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    className="hover:underline transition-all text-sm"
                    style={{ color: textColor, opacity: 0.8 }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = "0.8")}
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div
            className="flex flex-col md:flex-row justify-between items-center pt-4 border-t"
            style={{ borderColor: `rgba(${hexToRgb(textColor)}, 0.1)` }}
          >
            {showCopyright && (
              <div className="text-sm mb-4 md:mb-0">
                <p style={{ color: textColor }}>{copyrightText}</p>
              </div>
            )}

            {showSocialLinks && (
              <div className="flex space-x-2 my-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    className="hover:opacity-80 transition-opacity mx-1"
                    style={{ color: accentColor }}
                    aria-label={enableAccessibility ? `Visite nosso ${link.type}` : undefined}
                  >
                    {renderSocialIcon(link.type)}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.footer
      className={`w-full static-footer ${customClasses}`}
      {...getAnimationProps()}
      style={{
        ...getBackgroundStyle(),
        ...marginStyle,
        ...borderStyle,
        ...paddingStyle,
        color: textColor,
        ...(style || {}),
      }}
      id={id}
    >
      {renderFooterLayout()}
    </motion.footer>
  );
}
