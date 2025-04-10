"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  department?: string;
}

interface CollaboratorsListProps {
  title?: string;
  collaborators?: Collaborator[];
  showRole?: boolean;
  showDepartment?: boolean;
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  borderColor?: string;
  borderRadius?: number;
  maxHeight?: number;
  hidden?: boolean;
  className?: string;
  marginBottom?: number;
  animation?: "fade" | "slide" | "scale" | "none";
  animationDuration?: number;
  hoverEffect?: "translate" | "scale" | "glow" | "none";
}

const defaultCollaborators: Collaborator[] = [
  {
    id: "1",
    name: "Luiza Vieira",
    avatar: "/images/avatar.png",
    role: "Product Designer",
    department: "Design",
  },
  {
    id: "2",
    name: "Bruno Dino",
    avatar: "/images/avatar.png",
    role: "Frontend Developer",
    department: "Tecnologia",
  },
  {
    id: "3",
    name: "Carlos Silva",
    avatar: "/images/avatar.png",
    role: "UX Designer",
    department: "Design",
  },
  {
    id: "4",
    name: "Amanda Rocha",
    avatar: "/images/avatar.png",
    role: "Backend Developer",
    department: "Tecnologia",
  },
];

export default function StaticCollaboratorsList({
  title = "Profissionais",
  collaborators = defaultCollaborators,
  showRole = true,
  showDepartment = false,
  backgroundColor = "#ffffff",
  textColor = "#374151",
  titleColor = "#111827",
  borderColor = "#e5e7eb",
  borderRadius = 8,
  maxHeight = 300,
  hidden = false,
  className,
  marginBottom = 0,
  animation = "fade",
  animationDuration = 0.3,
  hoverEffect = "translate",
}: CollaboratorsListProps) {
  if (hidden) return null;

  // Configurações de animação inicial
  const getInitialAnimation = () => {
    switch (animation) {
      case "fade":
        return { opacity: 0 };
      case "slide":
        return { opacity: 0, y: 20 };
      case "scale":
        return { opacity: 0, scale: 0.9 };
      case "none":
      default:
        return {};
    }
  };

  // Configurações de animação final
  const getAnimateAnimation = () => {
    switch (animation) {
      case "fade":
        return { opacity: 1 };
      case "slide":
        return { opacity: 1, y: 0 };
      case "scale":
        return { opacity: 1, scale: 1 };
      case "none":
      default:
        return {};
    }
  };

  // Configurações de hover para os itens
  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case "translate":
        return { x: 3 };
      case "scale":
        return { scale: 1.02 };
      case "glow":
        return { boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)" };
      case "none":
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={`w-full ${className}`}
      style={{
        backgroundColor,
        color: textColor,
        borderRadius: `${borderRadius}px`,
        border: `1px solid ${borderColor}`,
        marginBottom: `${marginBottom}px`,
      }}
      initial={getInitialAnimation()}
      animate={getAnimateAnimation()}
      transition={{ duration: animationDuration }}
    >
      <div className="p-4">
        <h3 className="text-lg font-medium mb-3" style={{ color: titleColor }}>
          {title}
        </h3>

        <div className="space-y-3 overflow-y-auto" style={{ maxHeight: `${maxHeight}px` }}>
          {collaborators.map((collaborator) => (
            <motion.div key={collaborator.id} className="flex items-center gap-3" whileHover={getHoverAnimation()} transition={{ duration: 0.2 }}>
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image src={collaborator.avatar || "/placeholder.svg?height=40&width=40"} alt={collaborator.name} fill className="object-cover" />
              </div>
              <div>
                <p className="font-medium" style={{ color: textColor }}>
                  {collaborator.name}
                </p>
                {showRole && collaborator.role && <p className="text-sm opacity-70">{collaborator.role}</p>}
                {showDepartment && collaborator.department && <p className="text-sm opacity-70">{collaborator.department}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
