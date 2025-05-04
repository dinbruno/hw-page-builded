"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, MessageCircle, ChevronDown, Menu, X } from "lucide-react";

interface NavigationBarProps {
  logo?: string;
  menuItems?: { label: string; url: string }[];
  userName?: string;
  userAvatar?: string;
  backgroundColor?: string;
  textColor?: string;
  hidden?: boolean;
  hoverTextColor?: string;
  activeColor?: string;
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
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
  containerWidth?: "full" | "container" | "custom";
  customWidth?: number;
  shadow?: "none" | "sm" | "md" | "lg";
  logoHeight?: number;
  customClasses?: string;
  showNotifications?: boolean;
  showMessages?: boolean;
  showUserOptions?: boolean;
  layoutType?: "standard" | "compact" | "expanded";
  position?: "static" | "sticky" | "fixed";
  userStatusIndicator?: boolean;
  notificationCount?: number;
  messageCount?: number;
  id?: string;
  style?: React.CSSProperties;
}

const defaultBorder = {
  width: 0,
  style: "solid" as const,
  color: "#e5e7eb",
  radius: {
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0,
  },
};

export default function StaticNavigationBar({
  logo = "https://media.licdn.com/dms/image/v2/D4D0BAQGCqebSHxE6Aw/company-logo_200_200/company-logo_200_200/0/1700419200248/intranethywork_logo?e=2147483647&v=beta&t=FWD-8aa1YEtwQgD_JmcUk6eCWyWMB3ye0LhdCmRgE8M",
  menuItems = [
    { label: "Dashboard", url: "#" },
    { label: "Order", url: "#" },
    { label: "Static", url: "#" },
    { label: "Documents", url: "#" },
  ],
  userName = "Luiza Vieira",
  userAvatar = "https://images.unsplash.com/photo-1740252117012-bb53ad05e370?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  backgroundColor = "#ffffff",
  textColor = "#1f272f",
  hidden = false,
  hoverTextColor = "#3b82f6",
  activeColor = "#3b82f6",
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 12, right: 16, bottom: 12, left: 16 },
  border = defaultBorder,
  containerWidth = "container",
  customWidth = 1200,
  shadow = "none",
  logoHeight = 32,
  customClasses = "",
  showNotifications = true,
  showMessages = true,
  showUserOptions = true,
  layoutType = "standard",
  position = "static",
  userStatusIndicator = true,
  notificationCount = 1,
  messageCount = 0,
  id,
  style,
}: NavigationBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (hidden) return null;

  // Shadow classes based on selected option
  const shadowClass = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  }[shadow];

  // Container width style
  const containerStyle = containerWidth === "custom" ? { maxWidth: `${customWidth}px` } : {};
  const containerClass = containerWidth === "full" ? "w-full px-4" : "container mx-auto px-4";

  // Position classes
  const positionClass = {
    static: "",
    sticky: "sticky top-0 z-40",
    fixed: "fixed top-0 left-0 right-0 z-50",
  }[position];

  // Margin and padding styles
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

  // Border style
  const borderStyle = {
    borderWidth: border.width > 0 ? `${border.width}px` : 0,
    borderStyle: border.style,
    borderColor: border.color,
    borderRadius: `${border.radius.topLeft}px ${border.radius.topRight}px ${border.radius.bottomRight}px ${border.radius.bottomLeft}px`,
  };

  return (
    <motion.nav
      className={`w-full ${positionClass} ${shadowClass} ${
        layoutType === "compact" ? "py-2" : layoutType === "expanded" ? "py-5" : "py-4"
      } static-navigation-bar ${customClasses}`}
      style={{
        backgroundColor,
        color: textColor,
        ...marginStyle,
        ...borderStyle,
        ...(style || {}),
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      id={id}
    >
      <div className={containerClass} style={containerStyle}>
        <div className="flex items-center justify-between" style={paddingStyle}>
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <img src={logo || "/placeholder.svg"} alt="Logo" className={`w-auto mr-2 rounded-full`} style={{ height: `${logoHeight}px` }} />
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex space-x-6">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  className="transition-colors hover:text-opacity-80"
                  style={{ color: textColor }}
                  onMouseOver={(e) => (e.currentTarget.style.color = hoverTextColor)}
                  onMouseOut={(e) => (e.currentTarget.style.color = textColor)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button className="md:hidden flex items-center" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {showNotifications && (
              <div className="relative hidden sm:block">
                <Bell className="h-5 w-5 cursor-pointer" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 rounded-full text-xs text-white flex items-center justify-center h-4 w-4">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </div>
            )}

            {showMessages && (
              <div className="relative hidden sm:block">
                <MessageCircle className="h-5 w-5 cursor-pointer" />
                {messageCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center h-4 w-4">
                    {messageCount > 9 ? "9+" : messageCount}
                  </span>
                )}
              </div>
            )}

            {showUserOptions && (
              <div className="flex items-center space-x-2 cursor-pointer">
                <span className="hidden sm:inline">{userName}</span>
                <div className="relative">
                  <img
                    src={userAvatar || "/placeholder.svg"}
                    alt={userName}
                    className="h-8 w-8 rounded-full object-cover border-2"
                    style={{ borderColor: userStatusIndicator ? "#10b981" : "#e5e7eb" }}
                  />
                  {userStatusIndicator && <span className="absolute bottom-0 right-0 bg-green-500 rounded-full w-2 h-2 border border-white"></span>}
                </div>
                <ChevronDown className="h-4 w-4 hidden sm:block" />
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3" style={{ backgroundColor }}>
            <div className="px-2 space-y-2">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  className="block py-2 px-4 rounded transition-colors"
                  style={{ color: textColor }}
                  onMouseOver={(e) => (e.currentTarget.style.color = hoverTextColor)}
                  onMouseOut={(e) => (e.currentTarget.style.color = textColor)}
                >
                  {item.label}
                </a>
              ))}

              {/* Mobile notifications and messages */}
              <div className="flex space-x-4 py-2 px-4">
                {showNotifications && (
                  <div className="relative flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    <span>Notificações</span>
                    {notificationCount > 0 && (
                      <span className="ml-2 bg-red-500 rounded-full text-xs text-white flex items-center justify-center h-4 w-4">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {showMessages && (
                <div className="flex items-center py-2 px-4">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  <span>Mensagens</span>
                  {messageCount > 0 && (
                    <span className="ml-2 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center h-4 w-4">
                      {messageCount > 9 ? "9+" : messageCount}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
