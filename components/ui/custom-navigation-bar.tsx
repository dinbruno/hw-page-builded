import React, { useEffect } from "react";
import StaticNavigationBar from "@/components/static-renderer/components/static-navigation-bar";
import { UserAvatar } from "./user-avatar";

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

  // Handle dropdown clicks by intercepting document clicks
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if clicked element is a dropdown item
      if (target.closest("a[href]")) {
        const link = target.closest("a[href]") as HTMLAnchorElement;
        const href = link.getAttribute("href");

        // Find the dropdown item by href
        const clickedItem = userDropdownItems.find((item) => item.url === href);
        if (clickedItem && onDropdownItemClick) {
          if (href === "#" || clickedItem.id === "logout") {
            event.preventDefault();
            onDropdownItemClick(clickedItem.id);
          }
        }
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [userDropdownItems, onDropdownItemClick]);

  return <StaticNavigationBar {...props} userName={userName} userAvatar={getUserAvatarSrc()} userDropdownItems={userDropdownItems} />;
};
