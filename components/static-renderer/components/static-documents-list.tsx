"use client";

import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: string;
}

interface DocumentsListProps {
  title?: string;
  documents?: Document[];
  showDownloadButton?: boolean;
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  accentColor?: string;
  borderColor?: string;
  borderRadius?: number;
  maxHeight?: number;
  hidden?: boolean;
  className?: string;
  marginBottom?: number;
}

const defaultDocuments: Document[] = [
  {
    id: "1",
    name: "New Document.pdf",
    url: "#",
    type: "pdf",
    size: "2.5 MB",
  },
  {
    id: "2",
    name: "New Document.pdf",
    url: "#",
    type: "pdf",
    size: "1.8 MB",
  },
];

export default function StaticDocumentsList({
  title = "Documentos",
  documents = defaultDocuments,
  showDownloadButton = true,
  backgroundColor = "#ffffff",
  textColor = "#374151",
  titleColor = "#111827",
  accentColor = "#3b82f6",
  borderColor = "#e5e7eb",
  borderRadius = 8,
  maxHeight = 300,
  hidden = false,
  className,
  marginBottom = 0,
}: DocumentsListProps) {
  if (hidden) return null;

  const getFileIcon = (type: string) => {
    return <FileText size={20} />;
  };

  return (
    <motion.div
      className={`w-full ${className || ""}`}
      style={{
        backgroundColor,
        color: textColor,
        borderRadius: `${borderRadius}px`,
        border: `1px solid ${borderColor}`,
        marginBottom: `${marginBottom}px`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <h3 className="text-lg font-medium mb-3" style={{ color: titleColor }}>
          {title}
        </h3>

        <div className="space-y-2 overflow-y-auto" style={{ maxHeight: `${maxHeight}px` }}>
          {documents.map((doc) => (
            <motion.div
              key={doc.id}
              className="flex items-center p-3 border rounded-md"
              style={{ borderColor }}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex-shrink-0 mr-3" style={{ color: accentColor }}>
                {getFileIcon(doc.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{doc.name}</p>
                {doc.size && <p className="text-xs opacity-70">{doc.size}</p>}
              </div>
              {showDownloadButton && (
                <a href={doc.url} className="ml-2 p-2 rounded-full hover:bg-gray-100" style={{ color: accentColor }} title="Download">
                  <Download size={16} />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
