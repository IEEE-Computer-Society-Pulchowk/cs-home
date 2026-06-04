import React from "react";
import SmartImage from "@/components/smart-image";

interface PersonAvatarProps {
  src: string;
  alt: string;
  id: string;
  sizes?: string;
  className?: string;
  isClickable?: boolean;
}

export const PersonAvatar: React.FC<PersonAvatarProps> = ({
  src,
  alt,
  id,
  sizes,
  className = "relative w-full h-full",
  isClickable = true,
}) => {
  return (
    <div className={`bg-orange-100 rounded-xl overflow-hidden flex items-center justify-center ${className}`}>
      <div className="absolute inset-0">
        <SmartImage
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          href={isClickable ? `/people/${encodeURIComponent(id)}` : undefined}
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default PersonAvatar;
