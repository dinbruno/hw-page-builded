"use client";

import { motion } from "framer-motion";
import { useState, useEffect, Fragment } from "react";

interface CountdownProps {
  title?: string;
  targetDate?: string;

  // Time units display
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;

  // Layout options
  layout?: "horizontal" | "vertical" | "grid" | "compact" | "circular" | "digital" | "minimal" | "card";
  itemSpacing?: number;

  // Progress bar
  showProgressBar?: boolean;
  progressBarHeight?: number;
  progressBarColor?: string;
  progressBarBackgroundColor?: string;

  // Expired message
  expiredMessage?: string;
  expiredMessageColor?: string;
  expiredMessageSize?: number;

  // Animation
  animationType?: "none" | "pulse" | "bounce" | "glow" | "flip";
  animationDuration?: number;

  // Typography
  titleColor?: string;
  titleSize?: number;
  titleWeight?: "normal" | "medium" | "semibold" | "bold";
  numberColor?: string;
  numberSize?: number;
  numberWeight?: "normal" | "medium" | "semibold" | "bold";
  labelColor?: string;
  labelSize?: number;
  labelWeight?: "normal" | "medium" | "semibold" | "bold";

  // Background and styling
  backgroundColor?: string;
  borderRadius?: number;
  itemBackgroundColor?: string;
  itemBorderRadius?: number;
  itemPadding?: number;

  // Separators
  showSeparators?: boolean;
  separatorSymbol?: string;
  separatorColor?: string;
  separatorSize?: number;

  // Spacing
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
  hidden?: boolean;

  // Common component props
  id?: string;
  style?: React.CSSProperties;
  customClasses?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export default function StaticCountdown({
  title = "Contagem Regressiva",
  targetDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  layout = "horizontal",
  itemSpacing = 16,
  showProgressBar = false,
  progressBarHeight = 8,
  progressBarColor = "#3b82f6",
  progressBarBackgroundColor = "#e5e7eb",
  expiredMessage = "Tempo Esgotado!",
  expiredMessageColor = "#ef4444",
  expiredMessageSize = 24,
  animationType = "none",
  animationDuration = 1000,
  titleColor = "#1f2937",
  titleSize = 24,
  titleWeight = "bold",
  numberColor = "#3b82f6",
  numberSize = 32,
  numberWeight = "bold",
  labelColor = "#6b7280",
  labelSize = 14,
  labelWeight = "medium",
  backgroundColor = "transparent",
  borderRadius = 8,
  itemBackgroundColor = "#f9fafb",
  itemBorderRadius = 8,
  itemPadding = 16,
  showSeparators = true,
  separatorSymbol = ":",
  separatorColor = "#6b7280",
  separatorSize = 24,
  margin = { top: 20, right: 0, bottom: 20, left: 0 },
  padding = { top: 20, right: 20, bottom: 20, left: 20 },
  hidden = false,
  id,
  style,
  customClasses = "",
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  const calculateTimeLeft = () => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds, total: difference };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      setIsExpired(newTimeLeft.total <= 0);
    }, 1000);

    // Initial calculation
    const initialTimeLeft = calculateTimeLeft();
    setTimeLeft(initialTimeLeft);
    setIsExpired(initialTimeLeft.total <= 0);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (hidden) return null;

  const getAnimationProps = () => {
    const baseProps = {
      transition: {
        duration: animationDuration / 1000,
        repeat: animationType !== "none" ? Infinity : 0,
        repeatType: "reverse" as const,
      },
    };

    switch (animationType) {
      case "pulse":
        return {
          ...baseProps,
          animate: { scale: [1, 1.05, 1] },
        };
      case "bounce":
        return {
          ...baseProps,
          animate: { y: [0, -5, 0] },
        };
      case "glow":
        return {
          ...baseProps,
          animate: { opacity: [0.8, 1, 0.8] },
        };
      case "flip":
        return {
          ...baseProps,
          transition: { ...baseProps.transition, duration: 0.6 },
          animate: { rotateY: [0, 180, 360] },
        };
      default:
        return {};
    }
  };

  const getLayoutStyles = () => {
    const baseStyles: React.CSSProperties = {
      gap: `${itemSpacing}px`,
    };

    switch (layout) {
      case "horizontal":
        return {
          ...baseStyles,
          display: "flex",
          flexDirection: "row" as const,
          alignItems: "center",
          justifyContent: "center",
        };
      case "vertical":
        return {
          ...baseStyles,
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
        };
      case "grid":
        return {
          ...baseStyles,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
          justifyItems: "center",
        };
      case "compact":
        return {
          ...baseStyles,
          display: "flex",
          flexDirection: "row" as const,
          alignItems: "center",
          justifyContent: "center",
          gap: `${itemSpacing / 2}px`,
        };
      case "circular":
        return {
          ...baseStyles,
          display: "flex",
          flexDirection: "row" as const,
          alignItems: "center",
          justifyContent: "center",
          gap: `${itemSpacing * 1.5}px`,
        };
      case "digital":
        return {
          ...baseStyles,
          display: "flex",
          flexDirection: "row" as const,
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          backgroundColor: "#000",
          color: "#00ff00",
          padding: "20px",
          borderRadius: "8px",
        };
      case "minimal":
        return {
          ...baseStyles,
          display: "flex",
          flexDirection: "row" as const,
          alignItems: "baseline",
          justifyContent: "center",
          gap: `${itemSpacing / 3}px`,
        };
      case "card":
        return {
          ...baseStyles,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          justifyItems: "center",
          gap: `${itemSpacing * 1.2}px`,
        };
      default:
        return baseStyles;
    }
  };

  const renderTimeUnit = (value: number, label: string, show: boolean) => {
    if (!show) return null;

    const getUnitStyles = () => {
      switch (layout) {
        case "compact":
          return {
            backgroundColor: "transparent",
            borderRadius: `${itemBorderRadius}px`,
            padding: "4px",
            textAlign: "center" as const,
            minWidth: "auto",
          };
        case "circular":
          return {
            backgroundColor: itemBackgroundColor,
            borderRadius: "50%",
            padding: `${itemPadding * 1.2}px`,
            textAlign: "center" as const,
            minWidth: "80px",
            minHeight: "80px",
            display: "flex",
            flexDirection: "column" as const,
            justifyContent: "center",
            alignItems: "center",
            border: `3px solid ${numberColor}`,
          };
        case "digital":
          return {
            backgroundColor: "#111",
            borderRadius: "4px",
            padding: `${itemPadding}px`,
            textAlign: "center" as const,
            minWidth: "60px",
            border: "1px solid #333",
            boxShadow: "inset 0 0 10px rgba(0,255,0,0.3)",
          };
        case "minimal":
          return {
            backgroundColor: "transparent",
            borderRadius: "0",
            padding: "2px 4px",
            textAlign: "center" as const,
            minWidth: "auto",
          };
        case "card":
          return {
            backgroundColor: itemBackgroundColor,
            borderRadius: `${itemBorderRadius * 1.5}px`,
            padding: `${itemPadding * 1.5}px`,
            textAlign: "center" as const,
            minWidth: "100px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            border: "1px solid #e5e7eb",
          };
        default:
          return {
            backgroundColor: itemBackgroundColor,
            borderRadius: `${itemBorderRadius}px`,
            padding: `${itemPadding}px`,
            textAlign: "center" as const,
            minWidth: "80px",
          };
      }
    };

    const getNumberStyles = () => {
      switch (layout) {
        case "compact":
          return {
            color: numberColor,
            fontSize: `${numberSize * 0.8}px`,
            fontWeight: numberWeight,
            lineHeight: 1,
            marginBottom: "0",
          };
        case "digital":
          return {
            color: "#00ff00",
            fontSize: `${numberSize * 1.2}px`,
            fontWeight: "bold",
            lineHeight: 1,
            marginBottom: "4px",
            fontFamily: "monospace",
            textShadow: "0 0 10px #00ff00",
          };
        case "minimal":
          return {
            color: numberColor,
            fontSize: `${numberSize * 0.9}px`,
            fontWeight: numberWeight,
            lineHeight: 1,
            marginBottom: "0",
          };
        default:
          return {
            color: numberColor,
            fontSize: `${numberSize}px`,
            fontWeight: numberWeight,
            lineHeight: 1,
            marginBottom: "4px",
          };
      }
    };

    const getLabelStyles = () => {
      switch (layout) {
        case "digital":
          return {
            color: "#00aa00",
            fontSize: `${labelSize * 0.8}px`,
            fontWeight: labelWeight,
            textTransform: "uppercase" as const,
            letterSpacing: "1px",
            fontFamily: "monospace",
          };
        case "minimal":
          return {
            color: labelColor,
            fontSize: `${labelSize * 0.7}px`,
            fontWeight: "normal",
            textTransform: "lowercase" as const,
            letterSpacing: "0px",
            marginLeft: "2px",
          };
        default:
          return {
            color: labelColor,
            fontSize: `${labelSize}px`,
            fontWeight: labelWeight,
            textTransform: "uppercase" as const,
            letterSpacing: "0.5px",
          };
      }
    };

    const showLabel = !["compact", "minimal"].includes(layout);

    return (
      <motion.div key={label} style={getUnitStyles()} {...getAnimationProps()}>
        <div style={getNumberStyles()}>{value.toString().padStart(2, "0")}</div>
        {showLabel && <div style={getLabelStyles()}>{label}</div>}
        {layout === "minimal" && <span style={getLabelStyles()}>{label.charAt(0).toLowerCase()}</span>}
      </motion.div>
    );
  };

  const renderSeparator = () => {
    if (!showSeparators || ["vertical", "grid", "circular", "card"].includes(layout)) return null;

    const getSeparatorStyles = () => {
      switch (layout) {
        case "digital":
          return {
            color: "#00ff00",
            fontSize: `${separatorSize * 1.2}px`,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            fontFamily: "monospace",
            textShadow: "0 0 5px #00ff00",
          };
        case "minimal":
          return {
            color: separatorColor,
            fontSize: `${separatorSize * 0.8}px`,
            fontWeight: "normal",
            display: "flex",
            alignItems: "center",
            opacity: 0.6,
          };
        default:
          return {
            color: separatorColor,
            fontSize: `${separatorSize}px`,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          };
      }
    };

    return <div style={getSeparatorStyles()}>{separatorSymbol}</div>;
  };

  const getVisibleUnits = () => {
    const units = [];
    if (showDays) units.push({ value: timeLeft.days, label: "Dias", key: "days" });
    if (showHours) units.push({ value: timeLeft.hours, label: "Horas", key: "hours" });
    if (showMinutes) units.push({ value: timeLeft.minutes, label: "Minutos", key: "minutes" });
    if (showSeconds) units.push({ value: timeLeft.seconds, label: "Segundos", key: "seconds" });
    return units;
  };

  const calculateProgress = () => {
    if (!showProgressBar) return 0;

    // Calculate progress based on a week (7 days) for demo purposes
    const totalDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const elapsed = totalDuration - timeLeft.total;
    return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  };

  const marginStyle = {
    marginTop: `${margin?.top || 0}px`,
    marginRight: `${margin?.right || 0}px`,
    marginBottom: `${margin?.bottom || 0}px`,
    marginLeft: `${margin?.left || 0}px`,
  };

  const paddingStyle = {
    paddingTop: `${padding?.top || 0}px`,
    paddingRight: `${padding?.right || 0}px`,
    paddingBottom: `${padding?.bottom || 0}px`,
    paddingLeft: `${padding?.left || 0}px`,
  };

  if (isExpired) {
    return (
      <div className="w-full" style={{ maxWidth: "100vw", boxSizing: "border-box" }}>
        <motion.div
          className={`static-countdown ${customClasses}`}
          style={{
            width: `calc(100% - ${margin?.left || 0}px - ${margin?.right || 0}px)`,
            ...marginStyle,
            ...paddingStyle,
            backgroundColor,
            borderRadius: `${borderRadius}px`,
            textAlign: "center" as const,
            ...(style || {}),
          }}
          id={id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div
            style={{
              color: expiredMessageColor,
              fontSize: `${expiredMessageSize}px`,
              fontWeight: "bold",
            }}
          >
            {expiredMessage}
          </div>
        </motion.div>
      </div>
    );
  }

  const visibleUnits = getVisibleUnits();

  return (
    <div className="w-full" style={{ maxWidth: "100vw", boxSizing: "border-box" }}>
      <motion.div
        className={`static-countdown ${customClasses}`}
        style={{
          width: `calc(100% - ${margin?.left || 0}px - ${margin?.right || 0}px)`,
          ...marginStyle,
          ...paddingStyle,
          backgroundColor,
          borderRadius: `${borderRadius}px`,
          ...(style || {}),
        }}
        id={id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title && (
          <div
            style={{
              color: titleColor,
              fontSize: `${titleSize}px`,
              fontWeight: titleWeight,
              textAlign: "center" as const,
              marginBottom: "20px",
            }}
          >
            {title}
          </div>
        )}

        <div style={getLayoutStyles()}>
          {visibleUnits.map((unit, index) => (
            <Fragment key={unit.key}>
              {renderTimeUnit(unit.value, unit.label, true)}
              {index < visibleUnits.length - 1 && renderSeparator()}
            </Fragment>
          ))}
        </div>

        {showProgressBar && (
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                width: "100%",
                height: `${progressBarHeight}px`,
                backgroundColor: progressBarBackgroundColor,
                borderRadius: `${progressBarHeight / 2}px`,
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  backgroundColor: progressBarColor,
                  borderRadius: `${progressBarHeight / 2}px`,
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${calculateProgress()}%` }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
