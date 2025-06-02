"use client";

import { Calendar, User, Cake } from "lucide-react";

interface BirthdayCardProps {
  name: string;
  role?: string;
  date: string;
  avatar?: string;
  backgroundColor?: string;
  cardWidth?: number;
  cardHeight?: number;
}

export function BirthdayCard({ name, role, date, avatar, backgroundColor = "#d345f8", cardWidth = 300, cardHeight = 400 }: BirthdayCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-105"
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%)`,
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-16 h-16 rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
        <div className="absolute bottom-8 left-4 w-8 h-8 rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
        <div className="absolute top-1/3 left-1/2 w-12 h-12 rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }} />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white p-6">
        {/* Cake Icon */}
        <div className="mb-4">
          <Cake size={32} className="text-white/90" />
        </div>

        {/* Avatar */}
        <div className="mb-4">
          {avatar ? (
            <img src={avatar} alt={name} className="w-20 h-20 rounded-full object-cover border-4 border-white/20" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/20 flex items-center justify-center">
              <span className="text-xl font-bold text-white">{initials}</span>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-center mb-2 text-white">{name}</h3>

        {/* Role */}
        {role && (
          <div className="flex items-center mb-3 text-white/90">
            <User size={16} className="mr-2" />
            <span className="text-sm">{role}</span>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center text-white/90">
          <Calendar size={16} className="mr-2" />
          <span className="text-sm font-medium">{date}</span>
        </div>

        {/* Birthday Badge */}
        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-xs font-medium text-white">🎉 Aniversário</span>
        </div>
      </div>
    </div>
  );
}
