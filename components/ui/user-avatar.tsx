import React from "react";

interface UserAvatarProps {
  src?: string;
  initials?: string;
  size?: number;
  className?: string;
  name?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, initials, size = 40, className = "", name = "User" }) => {
  const [imageError, setImageError] = React.useState(false);

  // Generate initials from name if not provided
  const getInitials = (name: string) => {
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const displayInitials = initials || getInitials(name);
  const shouldShowImage = src && !imageError && src !== "/images/avatar.png";

  const avatarStyle = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
  };

  if (shouldShowImage) {
    return <img src={src} alt={name} className={`rounded-full object-cover ${className}`} style={avatarStyle} onError={() => setImageError(true)} />;
  }

  return (
    <div
      className={`rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold ${className}`}
      style={{
        ...avatarStyle,
        fontSize: size * 0.4,
      }}
      title={name}
    >
      {displayInitials}
    </div>
  );
};
