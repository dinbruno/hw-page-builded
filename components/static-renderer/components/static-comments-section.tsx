"use client";

import type React from "react";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Heart, MessageSquare, Send, ThumbsUp } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  date: string;
  likes?: number;
}

interface CommentsSectionProps {
  title?: string;
  showLikeCounter?: boolean;
  showViewCounter?: boolean;
  allowComments?: boolean;
  likeCount?: number;
  viewCount?: number;
  comments?: Comment[];
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  accentColor?: string;
  borderColor?: string;
  borderRadius?: number;
  hidden?: boolean;
}

const defaultComments: Comment[] = [
  {
    id: "1",
    author: "Luiza Vieira",
    authorAvatar: "/images/avatar.png",
    content: "Esse dia foi muito legal!",
    date: "2 minutos atrás",
    likes: 5,
  },
  {
    id: "2",
    author: "Bruno Dino",
    authorAvatar: "/images/avatar.png",
    content: "Parabéns para todas as mulheres",
    date: "2 minutos atrás",
    likes: 3,
  },
];

export default function StaticCommentsSection({
  title = "Comentários",
  showLikeCounter = true,
  showViewCounter = true,
  allowComments = true,
  likeCount = 120,
  viewCount = 350,
  comments = defaultComments,
  backgroundColor = "#ffffff",
  textColor = "#374151",
  titleColor = "#111827",
  accentColor = "#f23030",
  borderColor = "#e5e7eb",
  borderRadius = 8,
  hidden = false,
}: CommentsSectionProps) {
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  if (hidden) return null;

  const handleLike = () => {
    if (!liked) {
      setLocalLikeCount(localLikeCount + 1);
    } else {
      setLocalLikeCount(Math.max(0, localLikeCount - 1));
    }
    setLiked(!liked);
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        author: "Você",
        authorAvatar: "/images/avatar.png",
        content: commentText,
        date: "Agora mesmo",
        likes: 0,
      };

      setLocalComments([newComment, ...localComments]);
      setCommentText("");
    }
  };

  const handleCommentKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        {/* Counters */}
        {(showLikeCounter || showViewCounter) && (
          <div className="flex items-center gap-6 mb-4">
            {showLikeCounter && (
              <button className={`flex items-center gap-2 ${liked ? "text-red-500" : ""}`} onClick={handleLike}>
                <Heart className={`${liked ? "fill-current" : ""}`} size={18} />
                <span>{localLikeCount}</span>
              </button>
            )}

            {showViewCounter && (
              <div className="flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>{viewCount}</span>
              </div>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-medium mb-3 flex items-center gap-2" style={{ color: titleColor }}>
          <MessageSquare size={18} />
          {title}
        </h3>

        {/* Comment form */}
        {allowComments && (
          <div className="mb-6">
            <div className="flex gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image src="/images/avatar.png" alt="Seu avatar" fill className="object-cover" />
              </div>
              <div className="flex-1 relative">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={handleCommentKeyDown}
                  placeholder="Adicione um comentário..."
                  className="w-full p-2 pr-10 border rounded-lg resize-none min-h-[80px]"
                  style={{ borderColor }}
                />
                <button
                  className="absolute right-2 bottom-2 p-1 rounded-full hover:bg-gray-100"
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  style={{ color: accentColor, opacity: commentText.trim() ? 1 : 0.5 }}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comments list */}
        <div className="space-y-4">
          {localComments.map((comment) => (
            <motion.div
              key={comment.id}
              className="flex gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image src={comment.authorAvatar || "/placeholder.svg?height=40&width=40"} alt={comment.author} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-xs opacity-60">{comment.date}</span>
                </div>
                <p className="mt-1">{comment.content}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button className="flex items-center gap-1 text-sm opacity-70 hover:opacity-100">
                    <ThumbsUp size={14} />
                    {comment.likes && comment.likes > 0 ? comment.likes : "Curtir"}
                  </button>
                  <button className="text-sm opacity-70 hover:opacity-100">Responder</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
