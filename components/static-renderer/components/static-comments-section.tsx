"use client";

import type React from "react";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Send, Eye, MoreVertical, Reply, ThumbsUp, Share2, Flag } from "lucide-react";
import { NewsCommentsService } from "@/services/news-comments/news-comments.service";
import { NewsLikesService } from "@/services/news-likes/news-likes.service";
import type { NewsComment } from "@/services/news-comments/news-comments.types";
import type { NewsLike } from "@/services/news-likes/news-likes.types";
import { UserAvatar } from "@/components/ui/user-avatar";

// Interface para o autor dos comentários (mapeado da API)
interface CommentAuthor {
  name: string;
  avatar: string;
}

// Interface para comentários (local component)
interface Comment {
  id: string;
  author: CommentAuthor;
  content: string;
  likes?: number;
  isLiked?: boolean;
  timestamp: string;
  created_at?: string;
  date?: string;
}

// Interface para propriedades de margem e padding
interface SpacingProps {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Interface para propriedades de borda
interface BorderProps {
  width: number;
  style: "solid" | "dashed" | "dotted" | "none";
  color: string;
  radius: {
    topLeft: number;
    topRight: number;
    bottomRight: number;
    bottomLeft: number;
  };
}

interface StaticCommentsSectionProps {
  // API Integration
  newsSlug?: string;
  workspaceId?: string;
  currentUserId?: string; // For creating comments and likes

  // Current user display data
  currentUserName?: string;
  currentUserPhoto?: string;

  // Article stats (will be overridden by API data if newsSlug is provided)
  totalLikes?: number;
  totalViews?: number;
  isLiked?: boolean;

  // Comments (will be overridden by API data if newsSlug is provided)
  comments?: Comment[];
  allowComments?: boolean;
  showStats?: boolean;

  // Legacy props (maintain backward compatibility)
  title?: string;

  // Styling
  backgroundColor?: string;
  borderColor?: string;
  accentColor?: string;
  textColor?: string;
  titleColor?: string;
  commentBackgroundColor?: string;
  avatarShape?: "circle" | "square";

  // Layout
  maxWidth?: number;
  padding?: number;
  borderRadius?: number;

  // Spacing and borders
  margin?: SpacingProps;
  border?: BorderProps;

  // Behavior
  enableCharacterCount?: boolean;
  maxCharacters?: number;

  // Visibility
  hidden?: boolean;
  id?: string;
  style?: React.CSSProperties;
  customClasses?: string;
}

const defaultComments: Comment[] = [
  {
    id: "1",
    author: {
      name: "Luiza Vieira",
      avatar: "/images/avatar.png",
    },
    content: "Esse dia foi muito legal!",
    timestamp: "2 minutos atrás",
    likes: 5,
    isLiked: false,
  },
  {
    id: "2",
    author: {
      name: "Bruno Dino",
      avatar: "/images/avatar.png",
    },
    content: "Parabéns para todas as mulheres",
    timestamp: "2 minutos atrás",
    likes: 3,
    isLiked: false,
  },
  {
    id: "3",
    author: {
      name: "Maria Silva",
      avatar: "/images/avatar.png",
    },
    content: "Conteúdo muito interessante, parabéns pelo trabalho!",
    timestamp: "5 minutos atrás",
    likes: 8,
    isLiked: false,
  },
];

// Configuração padrão de borda
const defaultBorder: BorderProps = {
  width: 1,
  style: "solid",
  color: "#e5e7eb",
  radius: {
    topLeft: 16,
    topRight: 16,
    bottomRight: 16,
    bottomLeft: 16,
  },
};

// Function to map API comment to local comment interface
const mapApiCommentToLocal = (apiComment: NewsComment): Comment => {
  return {
    id: apiComment.id,
    author: {
      name: apiComment.author?.name || "Usuário Anônimo",
      avatar: apiComment.author?.thumbnail?.url || apiComment.author?.thumb || "/images/avatar.png",
    },
    content: apiComment.content,
    timestamp: apiComment.createdAt,
    created_at: apiComment.createdAt,
    likes: 0, // Individual comment likes not implemented in API yet
    isLiked: false,
  };
};

export default function StaticCommentsSection({
  // API Integration
  newsSlug,
  workspaceId,
  currentUserId = "default-user-id", // Default user ID for demo

  // Current user display data
  currentUserName = "Você",
  currentUserPhoto,

  // Comments
  comments = defaultComments,
  allowComments = true,

  // Legacy props (maintain backward compatibility)
  title = "Comentários",

  // Styling
  backgroundColor = "#ffffff",
  borderColor = "#e5e7eb",
  accentColor = "#3b82f6",
  textColor = "#374151",
  titleColor = "#111827",
  commentBackgroundColor = "#f9fafb",
  avatarShape = "circle",

  // Layout
  maxWidth = 0,
  padding = 24,
  borderRadius = 16,

  // Spacing and borders
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  border = defaultBorder,

  // Behavior
  enableCharacterCount = true,
  maxCharacters = 280,

  // Visibility
  hidden = false,
  id,
  style,
  customClasses = "",
}: StaticCommentsSectionProps) {
  // State management
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  // API-driven state
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Load data from API when newsSlug is provided
  useEffect(() => {
    if (newsSlug) {
      loadCommentsFromApi();
    }
  }, [newsSlug, workspaceId]);

  const loadCommentsFromApi = async () => {
    if (!newsSlug) return;

    setIsLoadingComments(true);
    try {
      const apiComments = await NewsCommentsService.getByNewsSlug(newsSlug, workspaceId);
      const mappedComments = apiComments.filter((comment) => comment.is_active).map(mapApiCommentToLocal);
      setLocalComments(mappedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      // Fall back to default comments on error
      setLocalComments(defaultComments);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    if (newsSlug && currentUserId) {
      // Submit to API
      setIsSubmittingComment(true);
      try {
        const commentOps = await NewsCommentsService.getAllCommentsBySlugOperations(newsSlug, workspaceId);
        await commentOps.createComment({
          author_id: currentUserId,
          content: commentText,
          is_active: true,
        });

        setCommentText("");
        // Reload comments from API
        await loadCommentsFromApi();
      } catch (error) {
        console.error("Error creating comment:", error);
        // Fall back to local comment creation
        createLocalComment();
      } finally {
        setIsSubmittingComment(false);
      }
    } else {
      // Local comment creation (fallback)
      createLocalComment();
    }
  };

  const createLocalComment = () => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: {
        name: currentUserName,
        avatar: currentUserPhoto || "/images/avatar.png",
      },
      content: commentText,
      timestamp: "agora mesmo",
      likes: 0,
      isLiked: false,
    };

    setLocalComments([newComment, ...localComments]);
    setCommentText("");
  };

  const handleCommentKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const formatTimestamp = (timestamp: string, createdAt?: string, date?: string) => {
    if (timestamp === "agora mesmo") return timestamp;
    if (date) return date;

    const dateToFormat = createdAt || timestamp;
    if (dateToFormat) {
      try {
        const commentDate = new Date(dateToFormat);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return "agora mesmo";
        if (diffInMinutes < 60) return `${diffInMinutes}min`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d`;

        return commentDate.toLocaleDateString();
      } catch (error) {
        return timestamp;
      }
    }
    return "agora mesmo";
  };

  const CommentItem = ({ comment }: { comment: Comment }) => {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex gap-3">
          <div className={`flex-shrink-0 ${avatarShape === "square" ? "rounded-md" : "rounded-full"}`}>
            <UserAvatar
              src={comment.author.avatar}
              name={comment.author.name}
              size={40}
              className={avatarShape === "square" ? "rounded-md" : "rounded-full"}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div
              className="rounded-2xl px-4 py-3 mb-2"
              style={{
                backgroundColor: commentBackgroundColor,
                border: `1px solid transparent`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm" style={{ color: textColor }}>
                  {comment.author.name}
                </span>
                <span className="text-xs opacity-60" style={{ color: textColor }}>
                  {formatTimestamp(comment.timestamp, comment.created_at, comment.date)}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: textColor }}>
                {comment.content}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (hidden) return null;

  const marginStyle = {
    marginTop: `${margin?.top || 0}px`,
    marginRight: `${margin?.right || 0}px`,
    marginBottom: `${margin?.bottom || 0}px`,
    marginLeft: `${margin?.left || 0}px`,
  };

  const borderStyle = {
    borderWidth: border && border.width > 0 ? `${border.width}px` : "0",
    borderStyle: border?.style || "solid",
    borderColor: borderColor || border?.color || "#e5e7eb",
    borderRadius: border?.radius
      ? `${border.radius.topLeft}px ${border.radius.topRight}px ${border.radius.bottomRight}px ${border.radius.bottomLeft}px`
      : `${borderRadius}px`,
  };

  const containerStyle = {
    backgroundColor: backgroundColor === "transparent" ? "transparent" : backgroundColor,
    maxWidth: maxWidth > 0 ? `${maxWidth}px` : "none",
    padding: `${padding}px`,
    ...borderStyle,
    ...marginStyle,
    ...(style || {}),
  };

  return (
    <motion.div
      className={`w-full static-comments-section ${customClasses}`}
      style={containerStyle}
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Comments Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: titleColor }}>
          <MessageCircle size={20} />
          {title} ({isLoadingComments ? "..." : localComments.length})
        </h3>

        {/* New Comment Form */}
        {allowComments && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
            <div className="flex gap-3">
              <div className={`flex-shrink-0 ${avatarShape === "square" ? "rounded-md" : "rounded-full"}`}>
                <UserAvatar
                  src={currentUserPhoto || "/images/avatar.png"}
                  name={currentUserName}
                  size={40}
                  className={avatarShape === "square" ? "rounded-md" : "rounded-full"}
                />
              </div>

              <div className="flex-1">
                <div className="relative">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={handleCommentKeyDown}
                    placeholder="Escreva um comentário..."
                    disabled={isSubmittingComment}
                    className="w-full p-3 pr-12 border rounded-2xl resize-none min-h-[80px] focus:outline-none focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      borderColor: borderColor,
                      backgroundColor: `${accentColor}04`,
                    }}
                    maxLength={enableCharacterCount ? maxCharacters : undefined}
                  />

                  <button
                    className="absolute right-3 bottom-3 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddComment}
                    disabled={!commentText.trim() || isSubmittingComment}
                    style={{
                      color: accentColor,
                      opacity: commentText.trim() && !isSubmittingComment ? 1 : 0.5,
                    }}
                  >
                    <Send size={18} />
                  </button>
                </div>

                <div className="flex justify-between items-center mt-2">
                  {enableCharacterCount && (
                    <span className="text-xs opacity-60" style={{ color: textColor }}>
                      {commentText.length}/{maxCharacters} caracteres
                    </span>
                  )}

                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim() || isSubmittingComment}
                    className="rounded-full px-6 py-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: accentColor,
                      color: "white",
                    }}
                  >
                    <Send size={14} className="mr-1 inline" />
                    {isSubmittingComment ? "Enviando..." : "Comentar"}
                  </button>
                </div>
              </div>
            </div>

            <div className="h-px w-full" style={{ backgroundColor: borderColor || "#e5e7eb" }} />
          </motion.div>
        )}

        {/* Comments List */}
        <AnimatePresence>
          {isLoadingComments ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: accentColor }} />
              <p style={{ color: textColor }}>Carregando comentários...</p>
            </motion.div>
          ) : localComments.length > 0 ? (
            <div className="space-y-4">
              {localComments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-30" style={{ color: textColor }} />
              <p className="text-lg font-medium mb-2" style={{ color: textColor }}>
                Nenhum comentário ainda
              </p>
              <p className="opacity-60" style={{ color: textColor }}>
                Seja o primeiro a comentar neste artigo!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
