"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  url: string;
}

interface StaticHeaderProps {
  logo?: string;
  logoText?: string;
  backgroundColor?: string;
  textColor?: string;
  navItems?: NavItem[];
  sticky?: boolean;
  transparent?: boolean;
  hidden?: boolean;
  className?: string;
}

export default function StaticHeader({
  logo = "https://media.licdn.com/dms/image/v2/D4D0BAQGCqebSHxE6Aw/company-logo_200_200/company-logo_200_200/0/1700419200248/intranethywork_logo?e=2147483647&v=beta&t=FWD-8aa1YEtwQgD_JmcUk6eCWyWMB3ye0LhdCmRgE8M",
  logoText = "hywork cloud",
  backgroundColor = "#ffffff",
  textColor = "#1f272f",
  navItems = [
    { id: "1", label: "Home", url: "#" },
    { id: "2", label: "Usuários", url: "#" },
    { id: "3", label: "Produtos", url: "#" },
    { id: "4", label: "Departamentos", url: "#" },
  ],
  sticky = false,
  transparent = false,
  hidden = false,
  className = "",
}: StaticHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (hidden) return null;

  return (
    <motion.header
      className={`w-full ${sticky ? "sticky top-0 z-50" : ""} ${className || ""}`}
      style={{
        backgroundColor: transparent ? "transparent" : backgroundColor,
        color: textColor,
      }}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <img src={logo || "/placeholder.svg"} alt="Logo" className="h-10 w-auto mr-2" />
            <span className="font-medium">{logoText}</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <div key={item.id} className="relative">
                <a href={item.url} className="hover:text-opacity-80 transition-colors">
                  {item.label}
                </a>
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <a href={item.url}>{item.label}</a>
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </motion.header>
  );
}
