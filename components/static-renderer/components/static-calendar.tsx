"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, X, Trash2, Edit, Save } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  color?: string;
  location?: string;
  allDay?: boolean;
  category?: string;
}

interface BackgroundValue {
  type: "color" | "image" | "gradient";
  color: string;
  image: {
    url: string;
    size: "cover" | "contain" | "auto";
    position: "center" | "top" | "bottom" | "left" | "right";
    repeat: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  };
  gradient: {
    type: "linear" | "radial";
    angle: number;
    colors: Array<{ color: string; position: number }>;
  };
  overlay: {
    enabled: boolean;
    color: string;
    opacity: number;
  };
}

interface StaticCalendarProps {
  title?: string;
  events?: CalendarEvent[];
  view?: "month" | "mini";
  showHeader?: boolean;
  showNavigation?: boolean;
  showToday?: boolean;
  showEventTime?: boolean;
  showEventLocation?: boolean;
  allowEventCreation?: boolean;
  allowEventEditing?: boolean;
  allowEventDeletion?: boolean;
  maxEventsPerDay?: number;
  weekStartsOn?: "sunday" | "monday";
  dateFormat?: "short" | "long";
  headerColor?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  eventTextColor?: string;
  todayColor?: string;
  borderColor?: string;
  hoverColor?: string;
  compactMode?: boolean;
  showWeekends?: boolean;
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
  background?: BackgroundValue;
  fontSize?: number;
  eventSize?: number;
  headerSize?: number;
  hidden?: boolean;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

const defaultBorder = {
  width: 1,
  style: "solid" as const,
  color: "#e5e7eb",
  radius: {
    topLeft: 8,
    topRight: 8,
    bottomRight: 8,
    bottomLeft: 8,
  },
};

const defaultBackground: BackgroundValue = {
  type: "color" as const,
  color: "#ffffff",
  image: {
    url: "",
    size: "cover" as const,
    position: "center" as const,
    repeat: "no-repeat" as const,
  },
  gradient: {
    type: "linear" as const,
    angle: 0,
    colors: [
      { color: "#ffffff", position: 0 },
      { color: "#f9fafb", position: 100 },
    ],
  },
  overlay: {
    enabled: false,
    color: "#000000",
    opacity: 50,
  },
};

const defaultEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Reunião de Equipe",
    description: "Reunião semanal da equipe de desenvolvimento",
    date: "2024-01-15",
    time: "09:00",
    color: "#3b82f6",
    location: "Sala de Reuniões",
    allDay: false,
    category: "Trabalho",
  },
  {
    id: "2",
    title: "Apresentação Cliente",
    description: "Apresentação do projeto para o cliente ABC",
    date: "2024-01-18",
    time: "14:30",
    color: "#ef4444",
    location: "Online",
    allDay: false,
    category: "Negócios",
  },
  {
    id: "3",
    title: "Workshop Design",
    description: "Workshop sobre design de interfaces",
    date: "2024-01-22",
    time: "",
    color: "#10b981",
    location: "Auditório",
    allDay: true,
    category: "Educação",
  },
  {
    id: "4",
    title: "Revisão de Projeto",
    description: "Revisão final do projeto X",
    date: "2024-01-25",
    time: "10:00",
    color: "#f59e0b",
    location: "Escritório",
    allDay: false,
    category: "Trabalho",
  },
  {
    id: "5",
    title: "Treinamento",
    description: "Treinamento em novas tecnologias",
    date: "2024-01-28",
    time: "",
    color: "#8b5cf6",
    location: "Centro de Treinamento",
    allDay: true,
    category: "Educação",
  },
];

export default function StaticCalendar({
  title = "Calendário",
  events = defaultEvents,
  view = "month",
  showHeader = true,
  showNavigation = true,
  showToday = true,
  showEventTime = true,
  showEventLocation = false,
  allowEventCreation = false, // Disabled for static version
  allowEventEditing = false, // Disabled for static version
  allowEventDeletion = false, // Disabled for static version
  maxEventsPerDay = 3,
  weekStartsOn = "sunday",
  dateFormat = "short",
  headerColor = "#1f2937",
  backgroundColor = "#ffffff",
  textColor = "#374151",
  accentColor = "#3b82f6",
  eventTextColor = "#ffffff",
  todayColor = "#dbeafe",
  borderColor = "#e5e7eb",
  hoverColor = "#f3f4f6",
  compactMode = false,
  showWeekends = true,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 16, right: 16, bottom: 16, left: 16 },
  border = defaultBorder,
  background = defaultBackground,
  fontSize = 13,
  eventSize = 11,
  headerSize = 14,
  hidden = false,
  className = "",
  style = {},
  id,
}: StaticCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  if (hidden) return null;

  const getDaysInMonth = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);

    const startOffset = weekStartsOn === "monday" ? (firstDay.getDay() + 6) % 7 : firstDay.getDay();

    const firstCalendarDay = new Date(firstDay);
    firstCalendarDay.setDate(firstCalendarDay.getDate() - startOffset);

    const days: Date[] = [];
    const totalDays = compactMode ? 35 : 42;

    for (let i = 0; i < totalDays; i++) {
      const day = new Date(firstCalendarDay);
      day.setDate(firstCalendarDay.getDate() + i);
      days.push(day);
    }

    return days;
  }, [currentDate, weekStartsOn, compactMode]);

  const getEventsForDay = useCallback(
    (day: Date) => {
      const dayStr = day.toISOString().split("T")[0];
      return events.filter((event) => event.date === dayStr);
    },
    [events]
  );

  const goToPreviousMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString("pt-BR", {
      month: dateFormat === "long" ? "long" : "short",
      year: "numeric",
    });
  };

  const getWeekDays = () => {
    const days = weekStartsOn === "monday" ? ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] : ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    return showWeekends ? days : days.slice(0, 5);
  };

  const getBackgroundStyle = () => {
    if (background.type === "color") {
      return { backgroundColor: background.color };
    }
    if (background.type === "image" && background.image.url) {
      return {
        backgroundImage: `url(${background.image.url})`,
        backgroundSize: background.image.size,
        backgroundPosition: background.image.position,
        backgroundRepeat: background.image.repeat,
      };
    }
    if (background.type === "gradient") {
      const colors = background.gradient.colors.map((c) => `${c.color} ${c.position}%`).join(", ");
      const gradientType =
        background.gradient.type === "linear" ? `linear-gradient(${background.gradient.angle}deg, ${colors})` : `radial-gradient(circle, ${colors})`;
      return { backgroundImage: gradientType };
    }
    return { backgroundColor: background.color };
  };

  const getBorderStyle = () => {
    return {
      borderWidth: `${border.width}px`,
      borderStyle: border.style,
      borderColor: border.color,
      borderRadius: `${border.radius.topLeft}px ${border.radius.topRight}px ${border.radius.bottomRight}px ${border.radius.bottomLeft}px`,
    };
  };

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

  const openEventModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const renderEvent = (event: CalendarEvent) => (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-xs px-1 py-0.5 rounded truncate mb-0.5 cursor-pointer hover:opacity-80 transition-all duration-200"
      style={{
        backgroundColor: event.color || accentColor,
        color: eventTextColor,
        fontSize: `${eventSize}px`,
      }}
      title={`${event.title}${showEventTime && event.time ? ` - ${event.time}` : ""}${
        showEventLocation && event.location ? ` (${event.location})` : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        openEventModal(event);
      }}
    >
      <div className="flex items-center">
        {showEventTime && event.time && !event.allDay && <Clock size={eventSize - 2} className="mr-1 flex-shrink-0" />}
        <span className="truncate">{event.title}</span>
      </div>
    </motion.div>
  );

  const renderEventModal = () => (
    <AnimatePresence>
      {showEventModal && selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeEventModal}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Detalhes do Evento</h3>
              <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={closeEventModal}>
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Título</h4>
                <p className="text-base">{selectedEvent.title}</p>
              </div>

              {selectedEvent.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Descrição</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Data</h4>
                  <p className="text-sm">
                    {new Date(selectedEvent.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {!selectedEvent.allDay && selectedEvent.time && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Horário</h4>
                    <p className="text-sm">{selectedEvent.time}</p>
                  </div>
                )}
              </div>

              {selectedEvent.allDay && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Tipo</h4>
                  <p className="text-sm">Evento de dia inteiro</p>
                </div>
              )}

              {selectedEvent.location && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Local</h4>
                  <p className="text-sm flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {selectedEvent.location}
                  </p>
                </div>
              )}

              {selectedEvent.category && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Categoria</h4>
                  <div
                    className="inline-block px-2 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: selectedEvent.color + "20",
                      color: selectedEvent.color,
                    }}
                  >
                    {selectedEvent.category}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <button onClick={closeEventModal} className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">
                Fechar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const today = new Date();
  const days = getDaysInMonth();
  const currentMonth = currentDate.getMonth();

  return (
    <motion.div
      className={`w-full static-calendar ${className}`}
      style={{
        ...getBackgroundStyle(),
        ...getBorderStyle(),
        ...marginStyle,
        ...paddingStyle,
        ...(style || {}),
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      id={id}
    >
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h3
            className="font-semibold flex items-center"
            style={{
              color: headerColor,
              fontSize: `${headerSize}px`,
            }}
          >
            <CalendarIcon size={headerSize} className="mr-2" />
            {title}
          </h3>
        </div>
      )}

      {/* Navigation */}
      {showNavigation && (
        <div className="flex items-center justify-between mb-3">
          <button onClick={goToPreviousMonth} className="p-2 rounded hover:bg-gray-100 transition-colors" style={{ color: textColor }}>
            <ChevronLeft size={18} />
          </button>

          <h4
            className="font-medium text-center flex-1"
            style={{
              color: headerColor,
              fontSize: `${fontSize + 1}px`,
            }}
          >
            {formatMonthYear()}
          </h4>

          <button onClick={goToNextMonth} className="p-2 rounded hover:bg-gray-100 transition-colors" style={{ color: textColor }}>
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {showToday && (
        <div className="text-center mb-3">
          <button
            onClick={goToToday}
            className="text-xs px-3 py-1.5 rounded border hover:bg-gray-50 transition-colors"
            style={{
              color: accentColor,
              borderColor: accentColor,
              fontSize: `${fontSize}px`,
            }}
          >
            Hoje
          </button>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="w-full">
        {/* Week days header */}
        <div className={`grid ${showWeekends ? "grid-cols-7" : "grid-cols-5"} gap-0.5 mb-2`}>
          {getWeekDays().map((day, index) => (
            <div
              key={index}
              className="text-center py-2 font-medium"
              style={{
                color: textColor,
                fontSize: `${fontSize}px`,
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className={`grid ${showWeekends ? "grid-cols-7" : "grid-cols-5"} gap-1`}>
          {days
            .filter((day) => showWeekends || (day.getDay() !== 0 && day.getDay() !== 6))
            .map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentMonth;
              const isToday = day.toDateString() === today.toDateString();
              const dayEvents = getEventsForDay(day);
              const displayEvents = dayEvents.slice(0, maxEventsPerDay);
              const hasMoreEvents = dayEvents.length > maxEventsPerDay;

              return (
                <motion.div
                  key={index}
                  className={`
                    relative p-2 border rounded-lg cursor-pointer transition-all duration-200
                    ${isCurrentMonth ? "" : "opacity-40"}
                    ${compactMode ? "min-h-[35px]" : "min-h-[80px]"}
                    hover:shadow-md
                  `}
                  style={{
                    backgroundColor: isToday ? todayColor : backgroundColor,
                    borderColor: borderColor,
                    fontSize: `${fontSize}px`,
                  }}
                  whileHover={{
                    backgroundColor: hoverColor,
                    scale: 1.02,
                  }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm ${isToday ? "font-bold" : "font-medium"}`} style={{ color: textColor }}>
                      {day.getDate()}
                    </span>
                  </div>

                  {!compactMode && (
                    <div className="space-y-1">
                      <AnimatePresence>{displayEvents.map(renderEvent)}</AnimatePresence>
                      {hasMoreEvents && (
                        <div
                          className="text-xs text-center opacity-70 cursor-pointer hover:opacity-100"
                          style={{
                            color: textColor,
                            fontSize: `${eventSize}px`,
                          }}
                        >
                          +{dayEvents.length - maxEventsPerDay} mais
                        </div>
                      )}
                    </div>
                  )}

                  {compactMode && dayEvents.length > 0 && (
                    <div className="absolute bottom-1 right-1 flex space-x-0.5">
                      {dayEvents.slice(0, 3).map((event, idx) => (
                        <div key={idx} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: event.color || accentColor }} />
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Mini events list for compact mode */}
      {compactMode && events.length > 0 && (
        <div className="mt-4 pt-3 border-t" style={{ borderColor: borderColor }}>
          <div className="space-y-2 max-h-24 overflow-y-auto">
            {events.slice(0, 4).map((event) => (
              <motion.div
                key={event.id}
                className="flex items-center text-xs cursor-pointer hover:bg-gray-50 p-1 rounded"
                style={{ fontSize: `${eventSize}px` }}
                onClick={() => openEventModal(event)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-2 h-2 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: event.color || accentColor }} />
                <span className="truncate flex-1" style={{ color: textColor }}>
                  {event.title}
                </span>
                {showEventTime && event.time && (
                  <span className="ml-2 text-xs opacity-70" style={{ color: textColor }}>
                    {event.time}
                  </span>
                )}
              </motion.div>
            ))}
            {events.length > 4 && (
              <div className="text-xs text-center opacity-70" style={{ color: textColor }}>
                +{events.length - 4} eventos
              </div>
            )}
          </div>
        </div>
      )}

      {/* Event Modal */}
      {renderEventModal()}
    </motion.div>
  );
}
