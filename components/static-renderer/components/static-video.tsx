"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface VideoProps {
  url?: string;
  videoType?: "youtube" | "vimeo" | "file";
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  width?: number | string;
  height?: number | string;
  alignment?: "left" | "center" | "right";
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
  backgroundColor?: string;
  hidden?: boolean;
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
  customClasses?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "custom";
  customAspectRatio?: string;
  id?: string;
  style?: React.CSSProperties;
}

const defaultBorder = {
  width: 0,
  style: "solid" as const,
  color: "#000000",
  radius: {
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0,
  },
};

export default function StaticVideo({
  url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  videoType = "youtube",
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  width = "100%",
  height = "auto",
  alignment = "center",
  margin = { top: 10, right: 10, bottom: 10, left: 10 },
  padding = { top: 0, right: 0, bottom: 0, left: 0 },
  backgroundColor = "transparent",
  hidden = false,
  border = defaultBorder,
  customClasses = "",
  aspectRatio = "16:9",
  customAspectRatio = "",
  id,
  style,
}: VideoProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((error) => {
          console.error("Video play failed:", error);
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const getVideoId = (url: string, type: "youtube" | "vimeo") => {
    if (type === "youtube") {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    } else if (type === "vimeo") {
      const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
      const match = url.match(regExp);
      return match ? match[3] : null;
    }
    return null;
  };

  const getEmbedUrl = () => {
    if (videoType === "youtube") {
      const videoId = getVideoId(url, "youtube");
      if (!videoId) return url;
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${
        controls ? 1 : 0
      }`;
    } else if (videoType === "vimeo") {
      const videoId = getVideoId(url, "vimeo");
      if (!videoId) return url;
      return `https://player.vimeo.com/video/${videoId}?autoplay=${autoPlay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${
        controls ? 1 : 0
      }`;
    }
    return url;
  };

  const getAspectRatio = () => {
    switch (aspectRatio) {
      case "16:9":
        return "56.25%"; // 9/16 * 100
      case "4:3":
        return "75%"; // 3/4 * 100
      case "1:1":
        return "100%";
      case "custom":
        return customAspectRatio || "56.25%";
      default:
        return "56.25%";
    }
  };

  const containerStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: aspectRatio === "custom" && height !== "auto" ? (typeof height === "number" ? `${height}px` : height) : "auto",
    marginTop: `${margin.top}px`,
    marginRight: `${margin.right}px`,
    marginBottom: `${margin.bottom}px`,
    marginLeft: `${margin.left}px`,
    paddingTop: `${padding.top}px`,
    paddingRight: `${padding.right}px`,
    paddingBottom: `${padding.bottom}px`,
    paddingLeft: `${padding.left}px`,
    backgroundColor,
    borderWidth: border.width > 0 ? `${border.width}px` : 0,
    borderStyle: border.style,
    borderColor: border.color,
    borderRadius: `${border.radius.topLeft}px ${border.radius.topRight}px ${border.radius.bottomRight}px ${border.radius.bottomLeft}px`,
    display: "flex",
    justifyContent: alignment === "left" ? "flex-start" : alignment === "right" ? "flex-end" : "center",
    position: "relative" as const,
    minHeight: "60px",
    ...(style || {}),
  };

  if (hidden) return null;

  return (
    <motion.div
      className={`relative static-video ${customClasses}`}
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      id={id}
    >
      <div className="relative w-full" style={{ paddingTop: getAspectRatio() }}>
        {videoType === "file" ? (
          <video
            ref={videoRef}
            src={url}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            controls={controls}
            className="absolute top-0 left-0 w-full h-full object-cover"
            onLoadedData={() => {
              if (videoRef.current) {
                videoRef.current.muted = isMuted;
              }
            }}
          />
        ) : (
          <iframe
            src={getEmbedUrl()}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video player"
          />
        )}

        {!controls && videoType === "file" && (
          <div className="absolute bottom-4 left-4 flex space-x-2 bg-black bg-opacity-50 p-2 rounded-full z-20">
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label={isMuted ? "Ativar som" : "Silenciar"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        )}

        {/* Overlay de carregamento/erro */}
        {!url && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                <Play size={24} />
              </div>
              <p className="text-sm">Nenhum vídeo configurado</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
