"use client";

import { motion } from "framer-motion";
import StaticNavigationBar from "./static-navigation-bar";
import StaticEnhancedImageGallery from "./static-enhanced-image-gallery";

interface GalleryTemplateProps {
  // Navigation Bar props
  logo?: string;
  menuItems?: Array<{
    label: string;
    url: string;
    id: string;
    linkType?: "custom-url" | "workspace-page";
    pageId?: string;
    subItems?: Array<{
      label: string;
      url: string;
      id: string;
      linkType?: "custom-url" | "workspace-page";
      pageId?: string;
    }>;
  }>;
  userName?: string;
  userAvatar?: string;
  userDropdownItems?: Array<{
    label: string;
    url: string;
    id: string;
    icon?: "User" | "Settings" | "LogOut";
    linkType?: "custom-url" | "workspace-page";
    pageId?: string;
  }>;
  backgroundColor?: string;
  textColor?: string;
  logoHeight?: number;

  // Enhanced Image Gallery props
  galleryTitle?: string;
  gallerySubtitle?: string;
  galleryLayout?: "masonry" | "grid" | "metro";
  galleryColumns?: 1 | 2 | 3 | 4 | 5;
  galleryGap?: number;
  galleryBorderRadius?: number;
  showGalleryTitle?: boolean;
  galleryTitleSize?: number;
  gallerySubtitleSize?: number;
  galleryTitleColor?: string;
  gallerySubtitleColor?: string;
  galleryBackgroundColor?: string;
  showSearchBar?: boolean;
  enableLightbox?: boolean;
  hoverEffect?: "zoom" | "darken" | "lighten" | "blur" | "grayscale" | "sepia" | "rotate" | "scale" | "none";
  hoverEffectIntensity?: number;
  showImageInfo?: boolean;
  galleryImages?: Array<{
    id: string;
    url: string;
    name: string;
    createdAt: string;
    width: number;
    height: number;
    size?: number;
    aspectRatio?: number;
    selected?: boolean;
  }>;

  // Template container props
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export default function StaticGalleryTemplate({
  // Navigation Bar props
  logo = "https://media.licdn.com/dms/image/v2/D4D0BAQGCqebSHxE6Aw/company-logo_200_200/company-logo_200_200/0/1700419200248/intranethywork_logo?e=2147483647&v=beta&t=FWD-8aa1YEtwQgD_JmcUk6eCWyWMB3ye0LhdCmRgE8M",
  menuItems = [
    { label: "Dashboard", url: "#", id: "dashboard", linkType: "custom-url" as const },
    { label: "Galeria", url: "#", id: "gallery", linkType: "custom-url" as const },
    { label: "Documentos", url: "#", id: "documents", linkType: "custom-url" as const },
  ],
  userName = "Luiza Vieira",
  userAvatar = "https://images.unsplash.com/photo-1740252117012-bb53ad05e370?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  userDropdownItems = [
    { label: "Perfil", url: "#", id: "profile", icon: "User" as const, linkType: "custom-url" as const },
    { label: "Configurações", url: "#", id: "settings", icon: "Settings" as const, linkType: "custom-url" as const },
    { label: "Sair", url: "#", id: "logout", icon: "LogOut" as const, linkType: "custom-url" as const },
  ],
  backgroundColor = "#ffffff",
  textColor = "#000000",
  logoHeight = 40,

  // Enhanced Image Gallery props
  galleryTitle = "Nossa Galeria",
  gallerySubtitle = "Veja as melhores fotos da nossa equipe",
  galleryLayout = "masonry",
  galleryColumns = 3,
  galleryGap = 16,
  galleryBorderRadius = 8,
  showGalleryTitle = true,
  galleryTitleSize = 32,
  gallerySubtitleSize = 18,
  galleryTitleColor = "#111827",
  gallerySubtitleColor = "#6B7280",
  galleryBackgroundColor = "#ffffff",
  showSearchBar = true,
  enableLightbox = true,
  hoverEffect = "zoom",
  hoverEffectIntensity = 0.6,
  showImageInfo = true,
  galleryImages,

  // Template container props
  className = "",
  style = {},
  id = "gallery-template",
}: GalleryTemplateProps) {
  return (
    <motion.div
      className={`w-full min-h-screen bg-gray-50 static-gallery-template ${className}`}
      style={style}
      id={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navigation Bar */}
      <StaticNavigationBar
        logo={logo}
        menuItems={menuItems}
        userName={userName}
        userAvatar={userAvatar}
        userDropdownItems={userDropdownItems}
        backgroundColor={backgroundColor}
        textColor={textColor}
        logoHeight={logoHeight}
      />

      {/* Main Content Container */}
      <main className="w-full">
        {/* Enhanced Image Gallery */}
        <div className="container mx-auto px-4 py-8">
          <StaticEnhancedImageGallery
            images={galleryImages}
            layout={galleryLayout}
            columns={galleryColumns}
            gap={galleryGap}
            borderRadius={galleryBorderRadius}
            showTitle={showGalleryTitle}
            title={galleryTitle}
            subtitle={gallerySubtitle}
            titleSize={galleryTitleSize}
            subtitleSize={gallerySubtitleSize}
            titleColor={galleryTitleColor}
            subtitleColor={gallerySubtitleColor}
            backgroundColor={galleryBackgroundColor}
            showSearchBar={showSearchBar}
            enableLightbox={enableLightbox}
            hoverEffect={hoverEffect}
            hoverEffectIntensity={hoverEffectIntensity}
            showImageInfo={showImageInfo}
            padding={{ top: 32, right: 32, bottom: 32, left: 32 }}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            border={{
              width: 0,
              style: "solid",
              color: "#e5e7eb",
              radius: {
                topLeft: 12,
                topRight: 12,
                bottomRight: 12,
                bottomLeft: 12,
              },
            }}
          />
        </div>
      </main>
    </motion.div>
  );
}
