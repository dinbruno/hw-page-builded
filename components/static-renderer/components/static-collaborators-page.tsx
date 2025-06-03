"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Plus, List, Grid } from "lucide-react";

interface Collaborator {
  id: string;
  name: string;
  startDate: string;
  role: string;
  avatar: string;
  department?: string;
  email?: string;
  phone?: string;
}

interface StaticCollaboratorsPageProps {
  title?: string;
  collaborators?: Collaborator[];
  backgroundColor?: string;
  textColor?: string;
  cardBackgroundColor?: string;
  cardTextColor?: string;
  accentColor?: string;
  headerColor?: string;
  viewType?: "grid" | "list";
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  showAvatar?: boolean;
  showStartDate?: boolean;
  showRole?: boolean;
  showDepartment?: boolean;
  showEmail?: boolean;
  showPhone?: boolean;
  hidden?: boolean;

  // Layout & Spacing
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
  gap?: number;

  // Border
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

  // Card Border
  cardBorder?: {
    width: number;
    style: "solid" | "dashed" | "dotted" | "none";
    color: string;
    radius: number;
  };

  // Typography
  titleFontSize?: number;
  titleFontWeight?: "normal" | "bold" | "light" | "medium" | "semibold";
  cardTitleFontSize?: number;
  cardTextFontSize?: number;

  // Alignment
  titleAlignment?: "left" | "center" | "right";
  cardContentAlignment?: "left" | "center" | "right";

  // Advanced Styling
  cardShadow?: boolean;
  cardHoverEffect?: boolean;
  showSearchBar?: boolean;
  showFilters?: boolean;
  showAddButton?: boolean;

  // Additional props for static usage
  id?: string;
  style?: React.CSSProperties;
  customClasses?: string;
  onAddCollaborator?: () => void;
  onFilterChange?: (filters: any) => void;
  onSearchChange?: (searchTerm: string) => void;
}

const defaultCollaborators: Collaborator[] = [
  {
    id: "1",
    name: "Luiza Vieira",
    startDate: "15/12/2023",
    role: "Designer",
    avatar:
      "https://plus.unsplash.com/premium_photo-1740473796650-1aa512e71b83?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    department: "Design",
    email: "luiza.vieira@empresa.com",
    phone: "(11) 99999-9999",
  },
  {
    id: "2",
    name: "Bruno Dino",
    startDate: "07/01/2024",
    role: "Desenvolvedor Frontend",
    avatar:
      "https://plus.unsplash.com/premium_photo-1740097670023-338a3d290b4a?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    department: "Tecnologia",
    email: "bruno.dino@empresa.com",
    phone: "(11) 88888-8888",
  },
  {
    id: "3",
    name: "Carlos Silva",
    startDate: "18/08/2023",
    role: "Desenvolvedor Backend",
    avatar: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop",
    department: "Tecnologia",
    email: "carlos.silva@empresa.com",
    phone: "(11) 77777-7777",
  },
  {
    id: "4",
    name: "Amanda Rocha",
    startDate: "24/11/2022",
    role: "Desenvolvedor Full Stack",
    avatar:
      "https://plus.unsplash.com/premium_photo-1740011638726-fbee21cb3f36?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    department: "Tecnologia",
    email: "amanda.rocha@empresa.com",
    phone: "(11) 66666-6666",
  },
  {
    id: "5",
    name: "Bianca Neves",
    startDate: "31/01/2024",
    role: "UX Designer",
    avatar:
      "https://plus.unsplash.com/premium_photo-1740473796650-1aa512e71b83?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    department: "Design",
    email: "bianca.neves@empresa.com",
    phone: "(11) 55555-5555",
  },
  {
    id: "6",
    name: "Carlos Henrique",
    startDate: "05/02/2023",
    role: "Head de Negócios",
    avatar: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop",
    department: "Comercial",
    email: "carlos.henrique@empresa.com",
    phone: "(11) 44444-4444",
  },
];

const defaultBorder = {
  width: 0,
  style: "solid" as const,
  color: "#e5e7eb",
  radius: {
    topLeft: 8,
    topRight: 8,
    bottomRight: 8,
    bottomLeft: 8,
  },
};

const defaultCardBorder = {
  width: 1,
  style: "solid" as const,
  color: "#e5e7eb",
  radius: 8,
};

export default function StaticCollaboratorsPage({
  title = "Nossos Colaboradores",
  collaborators = defaultCollaborators,
  backgroundColor = "#ffffff",
  textColor = "#1f2937",
  cardBackgroundColor = "#ffffff",
  cardTextColor = "#374151",
  accentColor = "#3b82f6",
  headerColor = "#1f2937",
  viewType = "grid",
  columns = 3,
  showAvatar = true,
  showStartDate = true,
  showRole = true,
  showDepartment = true,
  showEmail = false,
  showPhone = false,
  hidden = false,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 24, right: 24, bottom: 24, left: 24 },
  gap = 24,
  border = defaultBorder,
  cardBorder = defaultCardBorder,
  titleFontSize = 24,
  titleFontWeight = "bold",
  cardTitleFontSize = 16,
  cardTextFontSize = 14,
  titleAlignment = "left",
  cardContentAlignment = "left",
  cardShadow = true,
  cardHoverEffect = true,
  showSearchBar = true,
  showFilters = true,
  showAddButton = true,
  id,
  style,
  customClasses = "",
  onAddCollaborator,
  onFilterChange,
  onSearchChange,
}: StaticCollaboratorsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCollaborators, setFilteredCollaborators] = useState(collaborators);
  const [localViewType, setLocalViewType] = useState(viewType);

  // Update filtered collaborators when search term or collaborators change
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCollaborators(collaborators);
    } else {
      const filtered = collaborators.filter(
        (collaborator) =>
          collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          collaborator.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (collaborator.department && collaborator.department.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCollaborators(filtered);
    }
  }, [searchTerm, collaborators]);

  // Update local view type when prop changes
  useEffect(() => {
    setLocalViewType(viewType);
  }, [viewType]);

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    if (onSearchChange) {
      onSearchChange(newSearchTerm);
    }
  };

  const handleAddCollaborator = () => {
    if (onAddCollaborator) {
      onAddCollaborator();
    }
  };

  const handleFiltersClick = () => {
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  const toggleViewType = () => {
    const newViewType = localViewType === "grid" ? "list" : "grid";
    setLocalViewType(newViewType);
  };

  if (hidden) return null;

  // Determine grid columns class based on columns prop
  const gridColumnsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6",
  }[columns];

  // Build dynamic styles
  const containerStyle = {
    backgroundColor,
    color: textColor,
    marginTop: `${margin.top}px`,
    marginRight: `${margin.right}px`,
    marginBottom: `${margin.bottom}px`,
    marginLeft: `${margin.left}px`,
    paddingTop: `${padding.top}px`,
    paddingRight: `${padding.right}px`,
    paddingBottom: `${padding.bottom}px`,
    paddingLeft: `${padding.left}px`,
    borderWidth: `${border.width}px`,
    borderStyle: border.style,
    borderColor: border.color,
    borderTopLeftRadius: `${border.radius.topLeft}px`,
    borderTopRightRadius: `${border.radius.topRight}px`,
    borderBottomRightRadius: `${border.radius.bottomRight}px`,
    borderBottomLeftRadius: `${border.radius.bottomLeft}px`,
    ...(style || {}),
  };

  const titleStyle = {
    fontSize: `${titleFontSize}px`,
    fontWeight: titleFontWeight,
    color: headerColor,
    textAlign: titleAlignment as any,
  };

  const cardStyle = {
    backgroundColor: cardBackgroundColor,
    color: cardTextColor,
    borderWidth: `${cardBorder.width}px`,
    borderStyle: cardBorder.style,
    borderColor: cardBorder.color,
    borderRadius: `${cardBorder.radius}px`,
    textAlign: cardContentAlignment as any,
    boxShadow: cardShadow ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)" : "none",
    transition: cardHoverEffect ? "all 0.2s ease-in-out" : "none",
  };

  return (
    <motion.div
      className={`w-full static-collaborators-page ${customClasses}`}
      style={containerStyle}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      id={id}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 style={titleStyle}>{title}</h2>

        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-md transition-colors ${localViewType === "grid" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={toggleViewType}
            title="Visualização em Grid"
          >
            <Grid size={18} />
          </button>
          <button
            className={`p-2 rounded-md transition-colors ${localViewType === "list" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={toggleViewType}
            title="Visualização em Lista"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {(showSearchBar || showFilters || showAddButton) && (
        <div className="flex justify-between items-center mb-6">
          {showSearchBar && (
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Pesquisar colaboradores..."
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          )}

          <div className="flex space-x-2">
            {showFilters && (
              <button className="flex items-center px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors" onClick={handleFiltersClick}>
                <Filter size={16} className="mr-2" />
                Filtros
              </button>
            )}

            {showAddButton && (
              <button
                className="flex items-center px-3 py-2 text-white rounded-md transition-colors hover:opacity-90"
                style={{ backgroundColor: accentColor }}
                onClick={handleAddCollaborator}
              >
                <Plus size={16} className="mr-2" />
                Adicionar
              </button>
            )}
          </div>
        </div>
      )}

      {localViewType === "grid" ? (
        // Grid View
        <div className={`grid ${gridColumnsClass}`} style={{ gap: `${gap}px` }}>
          {filteredCollaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className={`border p-4 flex items-start ${cardHoverEffect ? "hover:shadow-md hover:scale-[1.02]" : ""} transition-all duration-200`}
              style={cardStyle}
            >
              <div className="flex items-start w-full">
                {showAvatar && (
                  <img
                    src={collaborator.avatar || "/placeholder.svg"}
                    alt={collaborator.name}
                    className="w-16 h-16 rounded-lg object-cover mr-4 flex-shrink-0"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <div className="space-y-1">
                    <h3 className="font-medium truncate" style={{ fontSize: `${cardTitleFontSize}px` }}>
                      {collaborator.name}
                    </h3>
                    {showRole && (
                      <div className="text-gray-600 truncate" style={{ fontSize: `${cardTextFontSize}px` }}>
                        {collaborator.role}
                      </div>
                    )}
                    {showDepartment && (
                      <div className="font-medium truncate" style={{ color: accentColor, fontSize: `${cardTextFontSize}px` }}>
                        {collaborator.department}
                      </div>
                    )}
                    {showStartDate && <div className="text-sm text-gray-500">Desde: {collaborator.startDate}</div>}
                    {showEmail && <div className="text-sm text-gray-600 truncate">{collaborator.email}</div>}
                    {showPhone && <div className="text-sm text-gray-600">{collaborator.phone}</div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="border rounded-lg overflow-hidden" style={{ borderColor: cardBorder.color }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {showAvatar && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                {showRole && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>}
                {showDepartment && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>}
                {showStartDate && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Início</th>}
                {showEmail && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>}
                {showPhone && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCollaborators.map((collaborator) => (
                <tr key={collaborator.id} className="hover:bg-gray-50">
                  {showAvatar && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} className="h-10 w-10 rounded-full object-cover" />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{collaborator.name}</div>
                  </td>
                  {showRole && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{collaborator.role}</div>
                    </td>
                  )}
                  {showDepartment && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium" style={{ color: accentColor }}>
                        {collaborator.department}
                      </div>
                    </td>
                  )}
                  {showStartDate && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{collaborator.startDate}</div>
                    </td>
                  )}
                  {showEmail && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{collaborator.email}</div>
                    </td>
                  )}
                  {showPhone && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{collaborator.phone}</div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
