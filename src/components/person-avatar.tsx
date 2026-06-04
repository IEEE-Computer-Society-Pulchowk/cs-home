import React from "react";
import SmartImage from "@/components/smart-image";
import { getPersonProfilePath } from "@/data/people";

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
  const profilePath = isClickable ? getPersonProfilePath(id) : undefined;

  return (
    <div className={`bg-orange-100 rounded-xl overflow-hidden flex items-center justify-center ${className}`}>
      <div className="absolute inset-0">
        <SmartImage
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          href={profilePath}
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default PersonAvatar;
