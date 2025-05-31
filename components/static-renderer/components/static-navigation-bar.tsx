"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, MessageCircle, ChevronDown, Menu, X, User, Settings, LogOut } from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  url: string;
  linkType?: "custom-url" | "workspace-page";
  pageId?: string;
}

interface UserDropdownItem {
  id: string;
  label: string;
  url: string;
  linkType?: "custom-url" | "workspace-page";
  pageId?: string;
  icon?: string;
}

interface NavigationBarProps {
  logo?: string;
  menuItems?: MenuItem[];
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
  userDropdownItems?: UserDropdownItem[];
  showUserDropdown?: boolean;
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

const defaultMenuItems: MenuItem[] = [
  { id: "1", label: "Dashboard", url: "#", linkType: "custom-url" },
  { id: "2", label: "Order", url: "#", linkType: "custom-url" },
  { id: "3", label: "Static", url: "#", linkType: "custom-url" },
  { id: "4", label: "Documents", url: "#", linkType: "custom-url" },
];

const defaultUserDropdownItems: UserDropdownItem[] = [
  { id: "profile", label: "Perfil", url: "/profile", linkType: "custom-url", icon: "User" },
  { id: "settings", label: "Configurações", url: "/settings", linkType: "custom-url", icon: "Settings" },
  { id: "logout", label: "Sair", url: "/logout", linkType: "custom-url", icon: "LogOut" },
];

const IconComponent = ({ iconName }: { iconName: string }) => {
  const icons: { [key: string]: React.ComponentType<any> } = {
    User,
    Settings,
    LogOut,
  };

  const Icon = icons[iconName] || User;
  return <Icon size={16} />;
};

export default function StaticNavigationBar({
  logo = "https://media.licdn.com/dms/image/v2/D4D0BAQGCqebSHxE6Aw/company-logo_200_200/company-logo_200_200/0/1700419200248/intranethywork_logo?e=2147483647&v=beta&t=FWD-8aa1YEtwQgD_JmcUk6eCWyWMB3ye0LhdCmRgE8M",
  menuItems = defaultMenuItems,
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
  notificationCount = 0,
  messageCount = 0,
  userDropdownItems = defaultUserDropdownItems,
  showUserDropdown = true,
  id,
  style,
}: NavigationBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

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
              {menuItems.map((item: MenuItem) => (
                <a
                  key={item.id}
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
              <div className="relative">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
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

                {/* User Dropdown */}
                {isUserDropdownOpen && showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                    <div className="py-1">
                      {userDropdownItems.map((item: UserDropdownItem) => (
                        <a
                          key={item.id}
                          href={item.url}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          {item.icon && <IconComponent iconName={item.icon} />}
                          <span className={item.icon ? "ml-2" : ""}>{item.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3" style={{ backgroundColor }}>
            <div className="px-2 space-y-2">
              {menuItems.map((item: MenuItem) => (
                <a
                  key={item.id}
                  href={item.url}
                  className="block py-2 px-4 rounded transition-colors"
                  style={{ color: textColor }}
                  onMouseOver={(e) => (e.currentTarget.style.color = hoverTextColor)}
                  onMouseOut={(e) => (e.currentTarget.style.color = textColor)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              {/* Mobile notifications and messages */}
              <div className="border-t pt-2 mt-2">
                {showNotifications && (
                  <div className="flex items-center py-2 px-4">
                    <Bell className="h-5 w-5 mr-2" />
                    <span>Notificações</span>
                    {notificationCount > 0 && (
                      <span className="ml-2 bg-red-500 rounded-full text-xs text-white flex items-center justify-center h-4 w-4">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    )}
                  </div>
                )}

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

                {/* Mobile user options */}
                {showUserOptions && showUserDropdown && (
                  <div className="border-t pt-2 mt-2">
                    <div className="flex items-center py-2 px-4 mb-2">
                      <img
                        src={userAvatar || "/placeholder.svg"}
                        alt={userName}
                        className="h-6 w-6 rounded-full object-cover border mr-2"
                        style={{ borderColor: userStatusIndicator ? "#10b981" : "#e5e7eb" }}
                      />
                      <span className="font-medium">{userName}</span>
                    </div>
                    {userDropdownItems.map((item: UserDropdownItem) => (
                      <a
                        key={item.id}
                        href={item.url}
                        className="flex items-center py-2 px-4 text-sm hover:bg-gray-50 transition-colors"
                        style={{ color: textColor }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon && <IconComponent iconName={item.icon} />}
                        <span className={item.icon ? "ml-2" : ""}>{item.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
