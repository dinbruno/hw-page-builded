"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

// Tipos para os eventos do calendário
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string | Date;
  end: string | Date;
  allDay?: boolean;
  color?: string;
  location?: string;
  attendees?: string[];
  category?: string;
  icon?: string;
}

// Propriedades do componente Calendário
interface CalendarProps {
  events?: CalendarEvent[];
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  textColor?: string;
  headerBackgroundColor?: string;
  cellBackgroundColor?: string;
  todayHighlightColor?: string;
  eventCornerRadius?: string;
  showWeekNumbers?: boolean;
  startWeekOn?: "sunday" | "monday";
  defaultView?: "month" | "week" | "day";
  allowEventCreation?: boolean;
  allowEventDeletion?: boolean;
  allowEventEditing?: boolean;
  showAllDayEvents?: boolean;
  compactMode?: boolean;
  showEventTime?: boolean;
  showEventLocation?: boolean;
  showEventAttendees?: boolean;
  eventTimeFormat?: "12h" | "24h";
  dateFormat?: string;
  firstDayOfWeek?: number;
  locale?: string;
  animation?: "fade" | "slide" | "scale" | "none";
  animationDuration?: number;
}

export default function StaticCalendar({
  events = [],
  primaryColor = "#3b82f6",
  secondaryColor = "#93c5fd",
  accentColor = "#2563eb",
  textColor = "#1f2937",
  headerBackgroundColor = "#ffffff",
  cellBackgroundColor = "#ffffff",
  todayHighlightColor = "#dbeafe",
  eventCornerRadius = "rounded-md",
  showWeekNumbers = false,
  startWeekOn = "sunday",
  defaultView = "month",
  allowEventCreation = true,
  allowEventDeletion = true,
  allowEventEditing = true,
  showAllDayEvents = true,
  compactMode = false,
  showEventTime = true,
  showEventLocation = true,
  showEventAttendees = false,
  eventTimeFormat = "24h",
  dateFormat = "dd/MM/yyyy",
  firstDayOfWeek = 0,
  locale = "pt-BR",
  animation = "fade",
  animationDuration = 0.3,
}: CalendarProps) {
  // Estado para armazenar a data atual exibida
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">(defaultView);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(
    events.map((event) => ({
      ...event,
      start: event.start instanceof Date ? event.start : new Date(event.start),
      end: event.end instanceof Date ? event.end : new Date(event.end),
    }))
  );

  // Atualizar eventos quando as props mudarem
  useEffect(() => {
    setCalendarEvents(
      events.map((event) => ({
        ...event,
        start: event.start instanceof Date ? event.start : new Date(event.start),
        end: event.end instanceof Date ? event.end : new Date(event.end),
      }))
    );
  }, [events]);

  // Função para obter os dias do mês atual
  const getDaysInMonth = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);

    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0);

    // Ajustar para o primeiro dia da semana
    const startOffset = (firstDay.getDay() - firstDayOfWeek + 7) % 7;
    const firstCalendarDay = new Date(firstDay);
    firstCalendarDay.setDate(firstCalendarDay.getDate() - startOffset);

    // Criar array com todos os dias a serem exibidos
    const days: Date[] = [];
    const totalDays = 42; // 6 semanas * 7 dias

    for (let i = 0; i < totalDays; i++) {
      const day = new Date(firstCalendarDay);
      day.setDate(firstCalendarDay.getDate() + i);
      days.push(day);
    }

    return days;
  }, [currentDate, firstDayOfWeek]);

  // Função para obter os dias da semana atual
  const getDaysInWeek = useCallback(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : firstDayOfWeek); // Ajustar para começar no dia correto

    date.setDate(diff);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + i);
      days.push(newDate);
    }

    return days;
  }, [currentDate, firstDayOfWeek]);

  // Função para obter as horas do dia atual
  const getHoursInDay = useCallback(() => {
    const hours: Date[] = [];
    const date = new Date(currentDate);
    date.setHours(0, 0, 0, 0);

    for (let i = 0; i < 24; i++) {
      const newDate = new Date(date);
      newDate.setHours(i);
      hours.push(newDate);
    }

    return hours;
  }, [currentDate]);

  // Função para formatar a data
  const formatDate = useCallback(
    (date: Date, format: string = dateFormat) => {
      try {
        const options: Intl.DateTimeFormatOptions = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        };
        return new Intl.DateTimeFormat(locale, options).format(date);
      } catch (error) {
        console.error("Error formatting date:", error);
        return date.toLocaleDateString();
      }
    },
    [dateFormat, locale]
  );

  // Função para formatar a hora
  const formatTime = useCallback(
    (date: Date) => {
      try {
        const options: Intl.DateTimeFormatOptions = {
          hour: "2-digit",
          minute: "2-digit",
          hour12: eventTimeFormat === "12h",
        };
        return new Intl.DateTimeFormat(locale, options).format(date);
      } catch (error) {
        console.error("Error formatting time:", error);
        return date.toLocaleTimeString();
      }
    },
    [eventTimeFormat, locale]
  );

  // Função para verificar se um evento está em um determinado dia
  const isEventInDay = useCallback((event: CalendarEvent, day: Date) => {
    const eventStart = event.start instanceof Date ? event.start : new Date(event.start);
    const eventEnd = event.end instanceof Date ? event.end : new Date(event.end);

    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    return (
      (eventStart >= dayStart && eventStart <= dayEnd) ||
      (eventEnd >= dayStart && eventEnd <= dayEnd) ||
      (eventStart <= dayStart && eventEnd >= dayEnd)
    );
  }, []);

  // Função para verificar se um evento está em uma determinada hora
  const isEventInHour = useCallback((event: CalendarEvent, hour: Date) => {
    if (event.allDay) return false;

    const eventStart = event.start instanceof Date ? event.start : new Date(event.start);
    const eventEnd = event.end instanceof Date ? event.end : new Date(event.end);

    const hourStart = new Date(hour);
    const hourEnd = new Date(hour);
    hourEnd.setHours(hourEnd.getHours() + 1);

    return (
      (eventStart >= hourStart && eventStart < hourEnd) ||
      (eventEnd > hourStart && eventEnd <= hourEnd) ||
      (eventStart <= hourStart && eventEnd >= hourEnd)
    );
  }, []);

  // Função para navegar para o mês anterior
  const goToPreviousMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (currentView === "month") {
        newDate.setMonth(prev.getMonth() - 1);
      } else if (currentView === "week") {
        newDate.setDate(prev.getDate() - 7);
      } else {
        newDate.setDate(prev.getDate() - 1);
      }
      return newDate;
    });
  };

  // Função para navegar para o próximo mês
  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (currentView === "month") {
        newDate.setMonth(prev.getMonth() + 1);
      } else if (currentView === "week") {
        newDate.setDate(prev.getDate() + 7);
      } else {
        newDate.setDate(prev.getDate() + 1);
      }
      return newDate;
    });
  };

  // Função para ir para hoje
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Obter propriedades de animação
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

  // Renderizar os dias da semana
  const renderWeekDays = () => {
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const orderedWeekDays = [...weekDays];

    // Reordenar os dias da semana com base no dia de início
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        orderedWeekDays.push(orderedWeekDays.shift()!);
      }
    }

    return (
      <div className="grid grid-cols-7 border-b">
        {orderedWeekDays.map((day, index) => (
          <div key={index} className="py-2 text-center text-sm font-medium" style={{ color: textColor }}>
            {day}
          </div>
        ))}
      </div>
    );
  };

  // Renderizar o calendário mensal
  const renderMonthView = () => {
    const days = getDaysInMonth();
    const currentMonth = currentDate.getMonth();
    const today = new Date();

    return (
      <div className="grid grid-cols-7 auto-rows-fr">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentMonth;
          const isToday = day.toDateString() === today.toDateString();
          const dayEvents = calendarEvents.filter((event) => isEventInDay(event, day));

          return (
            <div
              key={index}
              className={`
                border-b border-r p-1 min-h-[100px] 
                ${isCurrentMonth ? "" : "opacity-40"}
                ${isToday ? "" : ""}
                transition-colors
              `}
              style={{
                backgroundColor: isToday ? todayHighlightColor : cellBackgroundColor,
                color: textColor,
              }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm ${isToday ? "font-bold" : ""}`}>{day.getDate()}</span>
              </div>

              <div className={`space-y-1 ${compactMode ? "max-h-[80px] overflow-y-auto" : ""}`}>
                {dayEvents.slice(0, compactMode ? 3 : undefined).map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`
                      p-1 text-xs truncate ${eventCornerRadius}
                      hover:opacity-90 transition-opacity
                    `}
                    style={{
                      backgroundColor: event.color || primaryColor,
                      color: "#ffffff",
                    }}
                  >
                    {event.allDay ? (
                      <div className="flex items-center">
                        <span className="mr-1">●</span>
                        <span className="truncate">{event.title}</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {showEventTime && (
                          <span className="mr-1 whitespace-nowrap">
                            {formatTime(event.start instanceof Date ? event.start : new Date(event.start))}
                          </span>
                        )}
                        <span className="truncate">{event.title}</span>
                      </div>
                    )}
                  </motion.div>
                ))}

                {compactMode && dayEvents.length > 3 && <div className="text-xs text-center text-gray-500 mt-1">+ {dayEvents.length - 3} mais</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Renderizar a visualização semanal
  const renderWeekView = () => {
    const days = getDaysInWeek();
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const today = new Date();

    return (
      <div className="flex flex-col h-[600px]">
        <div className="grid grid-cols-8 border-b">
          <div className="py-2 text-center text-sm font-medium border-r"></div>
          {days.map((day, index) => {
            const isToday = day.toDateString() === today.toDateString();
            return (
              <div
                key={index}
                className={`
                  py-2 text-center text-sm font-medium border-r
                  ${isToday ? "font-bold" : ""}
                `}
                style={{
                  backgroundColor: isToday ? todayHighlightColor : headerBackgroundColor,
                  color: textColor,
                }}
              >
                <div>{day.getDate()}</div>
                <div className="text-xs">{day.toLocaleDateString(locale, { weekday: "short" })}</div>
              </div>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-8">
            <div className="col-span-1 border-r">
              {hours.map((hour) => (
                <div key={hour} className="h-12 border-b text-xs text-right pr-2 pt-1" style={{ color: textColor }}>
                  {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                </div>
              ))}
            </div>

            <div className="col-span-7 grid grid-cols-7">
              {days.map((day, dayIndex) => (
                <div key={dayIndex} className="border-r">
                  {hours.map((hour) => {
                    const hourDate = new Date(day);
                    hourDate.setHours(hour, 0, 0, 0);

                    const hourEvents = calendarEvents.filter((event) => !event.allDay && isEventInHour(event, hourDate));

                    return (
                      <div key={hour} className="h-12 border-b relative" style={{ backgroundColor: cellBackgroundColor }}>
                        {hourEvents.map((event) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`
                              absolute left-0 right-0 mx-1 p-1 text-xs truncate ${eventCornerRadius}
                              hover:opacity-90 transition-opacity
                            `}
                            style={{
                              backgroundColor: event.color || primaryColor,
                              color: "#ffffff",
                              top: "2px",
                              zIndex: 10,
                            }}
                          >
                            <div className="truncate">{event.title}</div>
                          </motion.div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All-day events */}
        {showAllDayEvents && (
          <div className="border-t mt-4 pt-2">
            <div className="font-medium mb-2 px-2">Eventos de dia inteiro</div>
            <div className="grid grid-cols-7 gap-2 px-2">
              {days.map((day, dayIndex) => {
                const allDayEvents = calendarEvents.filter((event) => event.allDay && isEventInDay(event, day));

                return (
                  <div key={dayIndex} className="min-h-[40px]">
                    {allDayEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`
                          p-1 mb-1 text-xs truncate cursor-pointer ${eventCornerRadius}
                          hover:opacity-90 transition-opacity
                        `}
                        style={{
                          backgroundColor: event.color || primaryColor,
                          color: "#ffffff",
                        }}
                      >
                        <div className="truncate">{event.title}</div>
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Renderizar a visualização diária
  const renderDayView = () => {
    const hours = getHoursInDay();

    return (
      <div className="flex flex-col h-[600px]">
        <div className="text-center py-4 font-medium border-b">{formatDate(currentDate)}</div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-24">
            {hours.map((hour, index) => {
              const hourEvents = calendarEvents.filter((event) => !event.allDay && isEventInHour(event, hour));

              return (
                <div key={index} className="border-b relative" style={{ height: "60px" }}>
                  <div className="absolute left-0 top-0 h-full border-r w-16 text-xs text-right pr-2 pt-1">
                    {hour.getHours() === 0
                      ? "12 AM"
                      : hour.getHours() < 12
                      ? `${hour.getHours()} AM`
                      : hour.getHours() === 12
                      ? "12 PM"
                      : `${hour.getHours() - 12} PM`}
                  </div>

                  <div className="absolute left-16 right-0 top-0 h-full">
                    {hourEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`
                          absolute left-0 right-0 mx-2 p-2 ${eventCornerRadius}
                          hover:opacity-90 transition-opacity
                        `}
                        style={{
                          backgroundColor: event.color || primaryColor,
                          color: "#ffffff",
                          top: "5px",
                          zIndex: 10,
                        }}
                      >
                        <div className="font-medium">{event.title}</div>
                        {event.description && <div className="text-xs mt-1 opacity-90">{event.description}</div>}
                        {showEventLocation && event.location && (
                          <div className="text-xs mt-1 flex items-center">
                            <MapPin size={12} className="mr-1" />
                            {event.location}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All-day events */}
        {showAllDayEvents && (
          <div className="border-t mt-4 pt-2">
            <div className="font-medium mb-2 px-4">Eventos de dia inteiro</div>
            <div className="px-4 space-y-1">
              {calendarEvents
                .filter((event) => event.allDay && isEventInDay(event, currentDate))
                .map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`
                      p-2 text-sm cursor-pointer ${eventCornerRadius}
                      hover:opacity-90 transition-opacity
                    `}
                    style={{
                      backgroundColor: event.color || primaryColor,
                      color: "#ffffff",
                    }}
                  >
                    <div className="font-medium">{event.title}</div>
                    {event.description && <div className="text-xs mt-1 opacity-90">{event.description}</div>}
                    {showEventLocation && event.location && (
                      <div className="text-xs mt-1 flex items-center">
                        <MapPin size={12} className="mr-1" />
                        {event.location}
                      </div>
                    )}
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div className="border rounded-lg shadow-sm overflow-hidden" style={{ backgroundColor: headerBackgroundColor }} {...getAnimationProps()}>
      {/* Cabeçalho do calendário */}
      <div className="p-4 border-b flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center">
          <button className="p-2 rounded-md hover:bg-gray-100 transition-colors" onClick={goToPreviousMonth}>
            <ChevronLeft size={20} />
          </button>

          <h2 className="text-lg font-medium mx-2">
            {currentView === "month"
              ? currentDate.toLocaleDateString(locale, { month: "long", year: "numeric" })
              : currentView === "week"
              ? `${formatDate(getDaysInWeek()[0])} - ${formatDate(getDaysInWeek()[6])}`
              : formatDate(currentDate)}
          </h2>

          <button className="p-2 rounded-md hover:bg-gray-100 transition-colors" onClick={goToNextMonth}>
            <ChevronRight size={20} />
          </button>

          <button className="ml-2 px-3 py-1 text-sm border rounded-md hover:bg-gray-100 transition-colors" onClick={goToToday}>
            Hoje
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="border rounded-md flex">
            <button
              className={`px-3 py-1 text-sm ${currentView === "month" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
              onClick={() => setCurrentView("month")}
            >
              Mês
            </button>
            <button
              className={`px-3 py-1 text-sm ${currentView === "week" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
              onClick={() => setCurrentView("week")}
            >
              Semana
            </button>
            <button
              className={`px-3 py-1 text-sm ${currentView === "day" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
              onClick={() => setCurrentView("day")}
            >
              Dia
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo do calendário */}
      <div className="bg-white">
        {currentView === "month" && (
          <>
            {renderWeekDays()}
            {renderMonthView()}
          </>
        )}

        {currentView === "week" && renderWeekView()}

        {currentView === "day" && renderDayView()}
      </div>
    </motion.div>
  );
}
