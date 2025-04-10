"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Gift, Cake, Calendar } from "lucide-react";

interface BirthdayPerson {
  id: string;
  name: string;
  avatar: string;
  date: string;
  department?: string;
}

interface BirthdayListProps {
  title?: string;
  showIcon?: boolean;
  iconType?: "gift" | "cake" | "calendar";
  people?: BirthdayPerson[];
  showDate?: boolean;
  showDepartment?: boolean;
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  accentColor?: string;
  borderColor?: string;
  borderRadius?: number;
  maxHeight?: number;
  hidden?: boolean;
  animation?: "fade" | "slide" | "scale" | "none";
  animationDuration?: number;
}

const defaultPeople: BirthdayPerson[] = [
  {
    id: "1",
    name: "Luiza Vieira",
    avatar: "/images/avatar.png",
    date: "15 de fevereiro",
    department: "Design",
  },
  {
    id: "2",
    name: "Bruno Dino",
    avatar: "/images/avatar.png",
    date: "22 de março",
    department: "Tecnologia",
  },
  {
    id: "3",
    name: "Carlos Silva",
    avatar: "/images/avatar.png",
    date: "10 de abril",
    department: "Design",
  },
  {
    id: "4",
    name: "Amanda Rocha",
    avatar: "/images/avatar.png",
    date: "05 de maio",
    department: "Tecnologia",
  },
];

export default function StaticBirthdayList({
  title = "Aniversariantes do Mês",
  showIcon = true,
  iconType = "cake",
  people = defaultPeople,
  showDate = true,
  showDepartment = false,
  backgroundColor = "#ffffff",
  textColor = "#374151",
  titleColor = "#111827",
  accentColor = "#f23030",
  borderColor = "#e5e7eb",
  borderRadius = 8,
  maxHeight = 300,
  hidden = false,
  animation = "fade",
  animationDuration = 0.3,
}: BirthdayListProps) {
  if (hidden) return null;

  const getIcon = () => {
    switch (iconType) {
      case "gift":
        return <Gift size={16} style={{ color: accentColor }} />;
      case "calendar":
        return <Calendar size={16} style={{ color: accentColor }} />;
      case "cake":
      default:
        return <Cake size={16} style={{ color: accentColor }} />;
    }
  };

  const getAnimationProps = () => {
    switch (animation) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: animationDuration },
        };
      case "slide":
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: animationDuration },
        };
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: animationDuration },
        };
      case "none":
      default:
        return {};
    }
  };

  return (
    <motion.div
      className="w-full"
      style={{
        backgroundColor,
        color: textColor,
        borderRadius: `${borderRadius}px`,
        border: `1px solid ${borderColor}`,
      }}
      {...getAnimationProps()}
    >
      <div className="p-4">
        <h3 className="text-lg font-medium mb-3 flex items-center gap-2" style={{ color: titleColor }}>
          {showIcon && getIcon()}
          {title}
        </h3>

        <div className="space-y-3 overflow-y-auto" style={{ maxHeight: `${maxHeight}px` }}>
          {people.map((person) => (
            <motion.div key={person.id} className="flex items-center gap-3" whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image src={person.avatar || "/placeholder.svg?height=40&width=40"} alt={person.name} fill className="object-cover" />
              </div>
              <div>
                <p className="font-medium" style={{ color: textColor }}>
                  {person.name}
                </p>
                {showDate && (
                  <p className="text-sm" style={{ color: accentColor }}>
                    {person.date}
                  </p>
                )}
                {showDepartment && person.department && <p className="text-sm opacity-70">{person.department}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
