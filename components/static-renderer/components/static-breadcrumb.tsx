"use client";

import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

// Interface para definir um item do breadcrumb
interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
}

// Interface para mapear rotas para labels amigáveis
interface RouteMapping {
  [key: string]: string;
}

// Interface para propriedades de margem e padding
interface SpacingProps {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Interface para propriedades de borda
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

// Interface principal do componente
interface StaticBreadcrumbProps {
  // Configurações de Conteúdo
  items?: BreadcrumbItem[];
  showHomeIcon?: boolean;
  homeLabel?: string;
  homeHref?: string;
  separator?: "chevron" | "/" | "|" | "-" | ">" | "•" | "custom";
  customSeparator?: string;
  // Configurações Visuais
  backgroundColor?: string;
  textColor?: string;
  activeColor?: string;
  linkColor?: string;
  hoverColor?: string;
  fontSize?: number;
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  textAlignment?: "left" | "center" | "right";
  // Configurações de Ícones e Separadores
  iconSize?: number;
  iconColor?: string;
  separatorSize?: number;
  separatorColor?: string;
  separatorStyle?: "icon" | "text";
  itemSpacing?: number;
  // Configurações de Layout
  maxWidth?: number;
  overflow?: "hidden" | "visible" | "scroll";
  shadow?: string;
  // Configurações de Efeitos
  hoverEffect?: "none" | "underline" | "background" | "scale" | "opacity";
  // Configurações de Mapeamento de Rotas (para geração automática)
  routeMapping?: RouteMapping;
  maxItems?: number;
  showRoot?: boolean;
  // Configurações de Comportamento
  enableLinks?: boolean;
  openInNewTab?: boolean;
  // Props comuns
  margin?: SpacingProps;
  padding?: SpacingProps;
  hidden?: boolean;
  border?: BorderProps;
  id?: string;
  style?: React.CSSProperties;
  customClasses?: string;
}

// Mapeamento padrão de rotas para labels amigáveis
const defaultRouteMapping: RouteMapping = {
  "": "Home",
  home: "Início",
  produtos: "Produtos",
  servicos: "Serviços",
  sobre: "Sobre Nós",
  contato: "Contato",
  blog: "Blog",
  noticias: "Notícias",
  equipe: "Equipe",
  portfolio: "Portfólio",
  projetos: "Projetos",
  documentos: "Documentos",
  downloads: "Downloads",
  suporte: "Suporte",
  ajuda: "Ajuda",
  faq: "FAQ",
  "politica-privacidade": "Política de Privacidade",
  "termos-uso": "Termos de Uso",
  admin: "Administração",
  dashboard: "Dashboard",
  configuracoes: "Configurações",
  perfil: "Perfil",
  relatorios: "Relatórios",
  usuarios: "Usuários",
  clientes: "Clientes",
  fornecedores: "Fornecedores",
  vendas: "Vendas",
  estoque: "Estoque",
  financeiro: "Financeiro",
  "recursos-humanos": "Recursos Humanos",
  marketing: "Marketing",
  intranet: "Intranet",
  hycloud: "HyCloud",
};

// Configuração padrão de borda
const defaultBorder: BorderProps = {
  width: 0,
  style: "solid",
  color: "#e5e7eb",
  radius: {
    topLeft: 8,
    topRight: 8,
    bottomRight: 8,
    bottomLeft: 8,
  },
};

export default function StaticBreadcrumb({
  items,
  showHomeIcon = true,
  homeLabel = "Início",
  homeHref = "/",
  separator = "chevron",
  customSeparator = "/",
  backgroundColor = "transparent",
  textColor = "#6b7280",
  activeColor = "#1f272f",
  linkColor = "#3b82f6",
  hoverColor = "#1d4ed8",
  fontSize = 14,
  fontWeight = "normal",
  textAlignment = "left",
  iconSize = 16,
  iconColor = "#6b7280",
  separatorSize = 16,
  separatorColor = "#6b7280",
  separatorStyle = "icon",
  itemSpacing = 8,
  maxWidth = 0,
  overflow = "hidden",
  shadow = "none",
  hoverEffect = "underline",
  routeMapping = defaultRouteMapping,
  maxItems = 5,
  showRoot = true,
  enableLinks = true,
  openInNewTab = false,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 8, right: 0, bottom: 8, left: 0 },
  hidden = false,
  border = defaultBorder,
  id,
  style,
  customClasses = "",
}: StaticBreadcrumbProps) {
  const pathname = usePathname();

  // Função para formatar label do segmento
  const formatSegmentLabel = (segment: string): string => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Gerar items do breadcrumb dinamicamente baseado na URL atual ou usar items fornecidos
  const breadcrumbItems = useMemo(() => {
    // Se items foram fornecidos, usar eles
    if (items && items.length > 0) {
      return items;
    }

    // Caso contrário, gerar automaticamente baseado na URL
    const generatedItems: BreadcrumbItem[] = [];

    // Adicionar item home se habilitado
    if (showRoot) {
      generatedItems.push({
        id: "home",
        label: homeLabel,
        href: homeHref,
      });
    }

    // Se estamos na página home, retornar apenas o item home
    if (pathname === "/" || pathname === homeHref) {
      return generatedItems;
    }

    // Dividir o pathname em segmentos
    const pathSegments = pathname.split("/").filter(Boolean);

    // Construir items baseado nos segmentos da URL
    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Decodificar o segmento da URL
      const decodedSegment = decodeURIComponent(segment);

      // Obter label do mapeamento ou usar o segmento formatado
      const label = routeMapping[segment] || routeMapping[decodedSegment] || formatSegmentLabel(decodedSegment);

      // Determinar se este item deve ter link (não é o último item ou links estão desabilitados)
      const isLast = index === pathSegments.length - 1;
      const href = !isLast && enableLinks ? currentPath : undefined;

      generatedItems.push({
        id: `segment-${index}`,
        label,
        href,
      });
    });

    // Limitar o número de items se necessário
    if (maxItems && generatedItems.length > maxItems) {
      const start = generatedItems.slice(0, 1); // Home
      const end = generatedItems.slice(-maxItems + 2); // Últimos items + espaço para "..."

      return [...start, { id: "ellipsis", label: "...", href: undefined }, ...end];
    }

    return generatedItems;
  }, [pathname, homeLabel, homeHref, showRoot, routeMapping, maxItems, enableLinks, formatSegmentLabel, items]);

  // Função para lidar com clique em link
  const handleLinkClick = (href: string) => {
    if (href && enableLinks) {
      if (openInNewTab) {
        window.open(href, "_blank");
      } else {
        window.location.href = href;
      }
    }
  };

  // Função para obter estilos de hover
  const getHoverStyles = () => {
    switch (hoverEffect) {
      case "underline":
        return "hover:underline";
      case "background":
        return "hover:bg-gray-100 hover:rounded hover:px-1";
      case "scale":
        return "hover:scale-105";
      case "opacity":
        return "hover:opacity-70";
      default:
        return "";
    }
  };

  // Renderizar separador
  const renderSeparator = () => {
    if (separatorStyle === "text" || separator !== "chevron") {
      const separatorText = separator === "custom" ? customSeparator : separator === "chevron" ? "›" : separator;
      return (
        <span
          style={{
            color: separatorColor,
            fontSize: `${separatorSize}px`,
            margin: `0 ${itemSpacing}px`,
          }}
        >
          {separatorText}
        </span>
      );
    }

    return (
      <ChevronRight
        style={{
          color: separatorColor,
          width: `${separatorSize}px`,
          height: `${separatorSize}px`,
          margin: `0 ${itemSpacing}px`,
        }}
      />
    );
  };

  if (hidden) return null;

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
    borderColor: border?.color || "#e5e7eb",
    borderRadius: border?.radius
      ? `${border.radius.topLeft}px ${border.radius.topRight}px ${border.radius.bottomRight}px ${border.radius.bottomLeft}px`
      : "0px",
  };

  const containerStyle = {
    backgroundColor: backgroundColor === "transparent" ? "transparent" : backgroundColor,
    boxShadow: shadow,
    maxWidth: maxWidth > 0 ? `${maxWidth}px` : "none",
    overflow,
    justifyContent: textAlignment === "center" ? "center" : textAlignment === "right" ? "flex-end" : "flex-start",
    ...borderStyle,
    ...marginStyle,
    ...paddingStyle,
    ...(style || {}),
  };

  return (
    <motion.nav
      className={`flex items-center static-breadcrumb ${customClasses}`}
      style={containerStyle}
      id={id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Ícone Home */}
      {showHomeIcon && (
        <motion.div
          className="flex items-center cursor-pointer"
          style={{ marginRight: `${itemSpacing}px` }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <Home
            style={{
              color: pathname === homeHref ? activeColor : iconColor,
              width: `${iconSize}px`,
              height: `${iconSize}px`,
            }}
            onClick={() => handleLinkClick(homeHref)}
          />
        </motion.div>
      )}

      {/* Items do Breadcrumb */}
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const isEllipsis = item.id === "ellipsis";
        const hasLink = item.href && enableLinks && !isLast;

        return (
          <div key={item.id} className="flex items-center">
            {/* Separador (não mostrar antes do primeiro item ou se showHomeIcon está ativo) */}
            {(index > 0 || (showHomeIcon && breadcrumbItems.length > 0)) && <div className="flex items-center">{renderSeparator()}</div>}

            {/* Item do Breadcrumb */}
            <motion.span
              className={`transition-colors ${isLast ? "font-medium" : ""} ${hasLink ? "cursor-pointer" : ""} ${hasLink ? getHoverStyles() : ""} ${
                isEllipsis ? "select-none" : ""
              }`}
              style={{
                color: isLast ? activeColor : hasLink ? linkColor : textColor,
                fontSize: `${fontSize}px`,
                fontWeight: isLast ? "medium" : fontWeight,
              }}
              onClick={() => hasLink && handleLinkClick(item.href!)}
              onMouseEnter={(e) => {
                if (hasLink && hoverEffect !== "none") {
                  e.currentTarget.style.color = hoverColor;
                }
              }}
              onMouseLeave={(e) => {
                if (hasLink) {
                  e.currentTarget.style.color = linkColor;
                }
              }}
              whileHover={hasLink ? { scale: hoverEffect === "scale" ? 1.05 : 1 } : {}}
              transition={{ duration: 0.2 }}
            >
              {item.label}
            </motion.span>
          </div>
        );
      })}
    </motion.nav>
  );
}
