import React from "react";
import StaticNavigationBar from "@/components/static-renderer/components/static-navigation-bar";

interface CustomNavigationBarProps {
  logo?: string;
  menuItems?: Array<{
    id: string;
    label: string;
    url: string;
    linkType?: "custom-url" | "workspace-page";
    pageId?: string;
  }>;
  userName?: string;
  userPhoto?: string;
  userDropdownItems?: Array<{
    id: string;
    label: string;
    url: string;
    linkType?: "custom-url" | "workspace-page";
    pageId?: string;
    icon?: string;
  }>;
  onDropdownItemClick?: (itemId: string) => void;
  backgroundColor?: string;
  textColor?: string;
  showNotifications?: boolean;
  showMessages?: boolean;
  showUserOptions?: boolean;
  layoutType?: "standard" | "compact" | "expanded";
  position?: "static" | "sticky" | "fixed";
}

export const CustomNavigationBar: React.FC<CustomNavigationBarProps> = ({
  userName = "",
  userPhoto,
  userDropdownItems = [],
  onDropdownItemClick,
  ...props
}) => {
  // Generate user avatar with initials fallback
  const getUserAvatarSrc = () => {
    if (userPhoto && userPhoto !== "/images/avatar.png") {
      return userPhoto;
    }

    // Generate initials-based avatar
    const getUserInitials = (name: string) => {
      if (!name) return "U";
      const nameParts = name.trim().split(" ");
      if (nameParts.length === 1) {
        return nameParts[0].charAt(0).toUpperCase();
      }
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    };

    const initials = getUserInitials(userName || "Usuário");
    // Create a simple data URL for initials avatar
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#3b82f6"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">
          ${initials}
        </text>
      </svg>
    `)}`;
  };

  return (
    <StaticNavigationBar
      {...props}
      userName={userName}
      userAvatar={getUserAvatarSrc()}
      userDropdownItems={userDropdownItems}
      onDropdownItemClick={onDropdownItemClick}
    />
  );
};
