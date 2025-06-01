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
  showHomeIcon?: boolean;
  homeLabel?: string;
  homeHref?: string;
  separator?: "chevron" | "/" | "|" | "-" | ">" | "•";
  // Configurações Visuais
  backgroundColor?: string;
  textColor?: string;
  activeColor?: string;
  linkColor?: string;
  hoverColor?: string;
  fontSize?: number;
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  // Configurações de Mapeamento de Rotas
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
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0,
  },
};

export default function StaticBreadcrumb({
  showHomeIcon = true,
  homeLabel = "Início",
  homeHref = "/",
  separator = "chevron",
  backgroundColor = "transparent",
  textColor = "#6b7280",
  activeColor = "#1f272f",
  linkColor = "#3b82f6",
  hoverColor = "#1d4ed8",
  fontSize = 14,
  fontWeight = "normal",
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

  // Gerar items do breadcrumb dinamicamente baseado na URL atual
  const breadcrumbItems = useMemo(() => {
    const items: BreadcrumbItem[] = [];

    // Adicionar item home se habilitado
    if (showRoot) {
      items.push({
        id: "home",
        label: homeLabel,
        href: homeHref,
      });
    }

    // Se estamos na página home, retornar apenas o item home
    if (pathname === "/" || pathname === homeHref) {
      return items;
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

      items.push({
        id: `segment-${index}`,
        label,
        href,
      });
    });

    // Limitar o número de items se necessário
    if (maxItems && items.length > maxItems) {
      const start = items.slice(0, 1); // Home
      const end = items.slice(-maxItems + 2); // Últimos items + espaço para "..."

      return [...start, { id: "ellipsis", label: "...", href: undefined }, ...end];
    }

    return items;
  }, [pathname, homeLabel, homeHref, showRoot, routeMapping, maxItems, enableLinks, formatSegmentLabel]);

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

  // Renderizar separador
  const renderSeparator = () => {
    if (separator === "chevron") {
      return <ChevronRight className="h-4 w-4" style={{ color: textColor }} />;
    }
    return <span style={{ color: textColor, fontSize: `${fontSize}px` }}>{separator}</span>;
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

  return (
    <motion.nav
      className={`flex items-center static-breadcrumb ${customClasses}`}
      style={{
        backgroundColor,
        ...marginStyle,
        ...paddingStyle,
        ...borderStyle,
        ...(style || {}),
      }}
      id={id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Ícone Home */}
      {showHomeIcon && (
        <motion.div className="flex items-center mr-2" whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
          <Home
            className="h-4 w-4 cursor-pointer"
            style={{ color: pathname === homeHref ? activeColor : linkColor }}
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
            {index > 0 || (showHomeIcon && breadcrumbItems.length > 0) ? <div className="mx-2 flex items-center">{renderSeparator()}</div> : null}

            {/* Item do Breadcrumb */}
            <motion.span
              className={`${isLast ? "font-medium" : ""} ${hasLink ? "cursor-pointer hover:underline" : ""} ${isEllipsis ? "select-none" : ""}`}
              style={{
                color: isLast ? activeColor : hasLink ? linkColor : textColor,
                fontSize: `${fontSize}px`,
                fontWeight: isLast ? "medium" : fontWeight,
                transition: "color 0.2s ease",
              }}
              onClick={() => hasLink && handleLinkClick(item.href!)}
              onMouseEnter={(e) => {
                if (hasLink) {
                  e.currentTarget.style.color = hoverColor;
                }
              }}
              onMouseLeave={(e) => {
                if (hasLink) {
                  e.currentTarget.style.color = linkColor;
                }
              }}
              whileHover={hasLink ? { scale: 1.05 } : {}}
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
