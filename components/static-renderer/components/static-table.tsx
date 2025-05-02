"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Plus, Trash2, ArrowUpDown, Edit, Filter } from "lucide-react";
import Image from "next/image";

// Tipos de campo suportados na tabela
type FieldType = "text" | "number" | "date" | "status" | "image" | "actions" | "badge";

// Estrutura de uma coluna na tabela
interface TableColumn {
  id: string;
  label: string;
  key: string;
  type: FieldType;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  visible?: boolean;
  options?: { value: string; label: string; color?: string }[]; // Para status, badges, etc.
}

// Dados de exemplo para a tabela
interface TableData {
  id: string;
  [key: string]: any;
}

// Props do componente StaticTable
interface StaticTableProps {
  title?: string;
  description?: string;
  columns?: TableColumn[];
  data?: TableData[];
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  showPagination?: boolean;
  showSearch?: boolean;
  showColumnVisibility?: boolean;
  allowExport?: boolean;
  allowFilters?: boolean;
  allowSorting?: boolean;
  backgroundColor?: string;
  textColor?: string;
  headerBackgroundColor?: string;
  headerTextColor?: string;
  borderColor?: string;
  accentColor?: string;
  hoverBackgroundColor?: string;
  stripeBackgroundColor?: string;
  showStripes?: boolean;
  borderRadius?: number;
  borderWidth?: number;
  hideCaption?: boolean;
  loading?: boolean;
  emptyStateMessage?: string;
  maxHeight?: number;
  fixedHeader?: boolean;
  fixedHeight?: boolean;
  fullWidth?: boolean;
  compactRows?: boolean;
  rowActions?: { label: string; action: string }[];
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  border?: {
    width: number;
    style: string;
    color: string;
    radius?: {
      topLeft: number;
      topRight: number;
      bottomLeft: number;
      bottomRight: number;
    };
  };
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  hidden?: boolean;
}

// Dados de exemplo para a tabela
const defaultData: TableData[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@example.com",
    role: "Administrador",
    status: "active",
    createdAt: "2023-01-15",
    avatar: "https://i.pravatar.cc/150?img=1",
    department: "TI",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@example.com",
    role: "Editor",
    status: "pending",
    createdAt: "2023-02-20",
    avatar: "https://i.pravatar.cc/150?img=5",
    department: "Marketing",
  },
  {
    id: "3",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@example.com",
    role: "Visualizador",
    status: "inactive",
    createdAt: "2023-03-10",
    avatar: "https://i.pravatar.cc/150?img=8",
    department: "Vendas",
  },
  {
    id: "4",
    name: "Ana Pereira",
    email: "ana.pereira@example.com",
    role: "Editor",
    status: "active",
    createdAt: "2023-04-05",
    avatar: "https://i.pravatar.cc/150?img=10",
    department: "Suporte",
  },
  {
    id: "5",
    name: "Carlos Mendes",
    email: "carlos.mendes@example.com",
    role: "Administrador",
    status: "active",
    createdAt: "2023-05-12",
    avatar: "https://i.pravatar.cc/150?img=12",
    department: "TI",
  },
];

// Colunas padrão para a tabela
const defaultColumns: TableColumn[] = [
  {
    id: "1",
    label: "Nome",
    key: "name",
    type: "text",
    width: "25%",
    sortable: true,
    filterable: true,
    visible: true,
  },
  {
    id: "2",
    label: "Email",
    key: "email",
    type: "text",
    width: "30%",
    sortable: true,
    filterable: true,
    visible: true,
  },
  {
    id: "3",
    label: "Perfil",
    key: "role",
    type: "text",
    width: "15%",
    sortable: true,
    filterable: true,
    visible: true,
  },
  {
    id: "4",
    label: "Status",
    key: "status",
    type: "status",
    width: "15%",
    sortable: true,
    filterable: true,
    visible: true,
    options: [
      { value: "active", label: "Ativo", color: "#10b981" },
      { value: "pending", label: "Pendente", color: "#f59e0b" },
      { value: "inactive", label: "Inativo", color: "#ef4444" },
    ],
  },
  {
    id: "5",
    label: "Data de criação",
    key: "createdAt",
    type: "date",
    width: "15%",
    sortable: true,
    filterable: true,
    visible: true,
  },
];

export default function StaticTable({
  title = "Tabela de usuários",
  description = "Lista de usuários e suas informações",
  columns = defaultColumns,
  data = defaultData,
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  showPagination = true,
  showSearch = true,
  showColumnVisibility = true,
  allowExport = false,
  allowFilters = true,
  allowSorting = true,
  backgroundColor = "#ffffff",
  textColor = "#374151",
  headerBackgroundColor = "#f9fafb",
  headerTextColor = "#111827",
  borderColor = "#e5e7eb",
  accentColor = "#3b82f6",
  hoverBackgroundColor = "#f3f4f6",
  stripeBackgroundColor = "#f9fafb",
  showStripes = true,
  borderRadius = 6,
  borderWidth = 1,
  hideCaption = false,
  loading = false,
  emptyStateMessage = "Nenhum dado encontrado",
  maxHeight = 500,
  fixedHeader = true,
  fixedHeight = false,
  fullWidth = true,
  compactRows = false,
  rowActions = [
    { label: "Editar", action: "edit" },
    { label: "Excluir", action: "delete" },
  ],
  margin,
  padding = { top: 16, right: 16, bottom: 16, left: 16 },
  border,
  shadow = "none",
  hidden = false,
}: StaticTableProps) {
  // Estado para controle de paginação, ordenação e filtros
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  if (hidden) return null;

  // Generate container style from props
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    width: fullWidth ? "100%" : "auto",
  };

  // Apply margins
  if (margin) {
    containerStyle.marginTop = `${margin.top}px`;
    containerStyle.marginRight = `${margin.right}px`;
    containerStyle.marginBottom = `${margin.bottom}px`;
    containerStyle.marginLeft = `${margin.left}px`;
  }

  // Apply padding if provided, otherwise use default padding
  if (padding) {
    containerStyle.padding = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
  } else {
    containerStyle.padding = "16px";
  }

  // Apply border
  if (border && border.width > 0) {
    containerStyle.borderWidth = `${border.width}px`;
    containerStyle.borderStyle = border.style || "solid";
    containerStyle.borderColor = border.color || borderColor;

    if (border.radius) {
      containerStyle.borderTopLeftRadius = `${border.radius.topLeft}px`;
      containerStyle.borderTopRightRadius = `${border.radius.topRight}px`;
      containerStyle.borderBottomLeftRadius = `${border.radius.bottomLeft}px`;
      containerStyle.borderBottomRightRadius = `${border.radius.bottomRight}px`;
    } else {
      containerStyle.borderRadius = `${borderRadius}px`;
    }
  } else if (border && border.radius) {
    // Apply just the border radius even if width is 0
    containerStyle.borderTopLeftRadius = `${border.radius.topLeft}px`;
    containerStyle.borderTopRightRadius = `${border.radius.topRight}px`;
    containerStyle.borderBottomLeftRadius = `${border.radius.bottomLeft}px`;
    containerStyle.borderBottomRightRadius = `${border.radius.bottomRight}px`;
    containerStyle.border = `0px solid transparent`; // Ensure border is set to handle radius
  } else {
    containerStyle.borderRadius = `${borderRadius}px`;
    containerStyle.border = `${borderWidth}px solid ${borderColor}`;
  }

  // Apply shadow
  if (shadow && shadow !== "none") {
    const shadowMap: Record<string, string> = {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    };
    containerStyle.boxShadow = shadowMap[shadow];
  }

  // Set max height for fixed height
  if (fixedHeight) {
    containerStyle.maxHeight = `${maxHeight}px`;
    containerStyle.overflowY = "auto";
  }

  // Renderiza o valor da célula com base no tipo
  const renderCellValue = (row: TableData, column: TableColumn) => {
    const value = row[column.key];

    switch (column.type) {
      case "text":
      case "number":
        return value;

      case "date":
        // Formatação simples para exemplo
        return value ? new Date(value).toLocaleDateString() : "-";

      case "status":
        const option = column.options?.find((opt) => opt.value === value);
        if (option) {
          return (
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${option.color}20`,
                color: option.color,
              }}
            >
              {option.label}
            </span>
          );
        }
        return value;

      case "image":
        return value ? (
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100" style={{ backgroundImage: `url(${value})`, backgroundSize: "cover" }} />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200" />
        );

      case "actions":
        return (
          <div className="flex space-x-1">
            {rowActions.map((action, index) => (
              <button
                key={index}
                className="p-1 hover:bg-gray-100 rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  // Ação simulada apenas
                  console.log(`Action ${action.action} on row ${row.id}`);
                }}
              >
                {action.action === "edit" ? (
                  <Edit className="h-4 w-4" />
                ) : action.action === "delete" ? (
                  <Trash2 className="h-4 w-4" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        );

      default:
        return value;
    }
  };

  // Funções para ordenação, filtro e paginação
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  // Filtrar e ordenar dados
  let filteredData = [...data];

  // Aplicar filtro de busca em todas as colunas
  if (searchValue && showSearch) {
    const searchLower = searchValue.toLowerCase();
    filteredData = filteredData.filter((row) => {
      return columns.some((column) => {
        const value = row[column.key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchLower);
      });
    });
  }

  // Aplicar ordenação
  if (sortColumn && allowSorting) {
    filteredData.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Aplicar paginação
  const pageCount = Math.ceil(filteredData.length / pageSize);
  const paginatedData = showPagination ? filteredData.slice(currentPage * pageSize, (currentPage + 1) * pageSize) : filteredData;

  return (
    <motion.div className="w-full" style={containerStyle} animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {/* Cabeçalho da tabela */}
      {!hideCaption && (title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-medium" style={{ color: headerTextColor }}>
              {title}
            </h3>
          )}
          {description && <p className="text-sm opacity-70">{description}</p>}
        </div>
      )}

      {/* Controles da tabela */}
      {(showSearch || showColumnVisibility || allowExport) && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          {showSearch && (
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-md"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          )}

          <div className="flex gap-2">
            {allowFilters && (
              <button style={{ borderColor }} className="flex items-center gap-1 py-1 px-3 text-sm rounded-md border">
                <Filter className="h-4 w-4" />
                Filtros
              </button>
            )}

            {showColumnVisibility && (
              <button style={{ borderColor }} className="flex items-center gap-1 py-1 px-3 text-sm rounded-md border">
                <MoreHorizontal className="h-4 w-4" />
                Colunas
              </button>
            )}

            {allowExport && (
              <button style={{ borderColor }} className="flex items-center gap-1 py-1 px-3 text-sm rounded-md border">
                <MoreHorizontal className="h-4 w-4" />
                Exportar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tabela */}
      <div
        className="rounded-md border border-solid"
        style={{
          borderColor,
          maxHeight: fixedHeader ? `${maxHeight}px` : "none",
          overflow: fixedHeader ? "auto" : "visible",
        }}
      >
        <table className="w-full border-collapse">
          {!hideCaption && <caption className="text-sm p-2 text-left text-gray-500">{emptyStateMessage}</caption>}

          <thead style={{ backgroundColor: headerBackgroundColor, position: fixedHeader ? "sticky" : "static", top: 0, zIndex: 1 }}>
            <tr>
              {columns
                .filter((col) => col.visible !== false)
                .map((column) => (
                  <th
                    key={column.id}
                    className={`p-3 text-left border-b ${allowSorting && column.sortable ? "cursor-pointer select-none" : ""}`}
                    style={{
                      color: headerTextColor,
                      width: column.width || "auto",
                      borderColor,
                    }}
                    onClick={() => {
                      if (allowSorting && column.sortable) {
                        handleSort(column.key);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {allowSorting && column.sortable && <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Carregando...</p>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-8">
                  <p className="text-sm text-gray-500">{emptyStateMessage}</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  style={{
                    backgroundColor: showStripes && rowIndex % 2 === 1 ? stripeBackgroundColor : backgroundColor,
                    height: compactRows ? "40px" : "auto",
                  }}
                  className="hover:bg-gray-50"
                >
                  {columns
                    .filter((col) => col.visible !== false)
                    .map((column) => (
                      <td
                        key={`${row.id}-${column.id}`}
                        style={{ color: textColor, borderColor }}
                        className={`p-3 border-b ${compactRows ? "py-2" : ""}`}
                      >
                        {renderCellValue(row, column)}
                      </td>
                    ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {showPagination && pageCount > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Mostrando {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, filteredData.length)} de {filteredData.length}
            </span>

            <select
              value={pageSize.toString()}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(0);
              }}
              className="border rounded-md py-1 px-2 text-sm"
              style={{ borderColor }}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option.toString()}>
                  {option} linhas
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-1">
            <button
              className="py-1 px-3 text-sm rounded-md border"
              style={{ borderColor }}
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
            >
              Primeira
            </button>
            <button
              className="py-1 px-3 text-sm rounded-md border"
              style={{ borderColor }}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Anterior
            </button>
            <button
              className="py-1 px-3 text-sm rounded-md border"
              style={{ borderColor }}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= pageCount - 1}
            >
              Próxima
            </button>
            <button
              className="py-1 px-3 text-sm rounded-md border"
              style={{ borderColor }}
              onClick={() => setCurrentPage(pageCount - 1)}
              disabled={currentPage >= pageCount - 1}
            >
              Última
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
