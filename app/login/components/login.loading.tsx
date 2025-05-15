"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LoadingProps {
  workspaceInfo?: {
    workspace?: {
      favicon_file?: {
        url?: string;
      } | null;
    } | null;
    theme?: {
      color_primary_hex?: string;
      color_background?: string;
    } | null;
  };
}

export default function LoginLoadingElegant({ workspaceInfo }: LoadingProps) {
  // Get primary color with fallback
  const primaryColor = workspaceInfo?.theme?.color_primary_hex || "#3B82F6";
  const backgroundColor = workspaceInfo?.theme?.color_background || "#ffffff";
  const logoUrl = workspaceInfo?.workspace?.favicon_file?.url;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50" style={{ backgroundColor }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="flex flex-col items-center">
        {/* Logo */}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="mb-16 relative">
          {logoUrl ? (
            <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
              <Image src={logoUrl || "/placeholder.svg"} alt="Logo" width={90} height={90} className="w-[90px] h-auto" />
            </motion.div>
          ) : (
            <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
              <Image src="/Logo.png" alt="Logo" width={90} height={90} className="w-[90px] h-auto" />
            </motion.div>
          )}
        </motion.div>

        {/* Elegant loading bar */}
        <div className="w-48 h-[2px] bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: primaryColor }}
            initial={{ width: "0%" }}
            animate={{
              width: ["0%", "100%"],
              x: ["-100%", "0%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
