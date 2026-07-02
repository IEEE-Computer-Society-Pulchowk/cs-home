"use client";

import React, { useState } from "react";
import Link from "next/link";

// Images are served unoptimized (next.config: output export), so a plain <img>
// is all next/image would give us anyway. Behavior: show the real image; until
// it loads (fill mode) or if it fails, the IEEE-CS logo shows in its place.
const FALLBACK = "/logo-orange.svg";

interface SmartImageProps {
  src?: string | null;
  alt?: string;
  href?: string;
  className?: string;
  fill?: boolean;
  sizes?: string; // accepted for call-site compat; unused with unoptimized images
  onClick?: (e: React.MouseEvent) => void;
  loading?: "lazy" | "eager";
  style?: React.CSSProperties;
}

export default function SmartImage({
  src,
  alt = "",
  href,
  className,
  fill = false,
  onClick,
  loading = "lazy",
  style,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const showReal = !!src && !failed;

  /* eslint-disable @next/next/no-img-element */
  const logo = (
    <img src={FALLBACK} alt="" aria-hidden className="h-2/5 w-2/5 object-contain opacity-60" />
  );

  const real = (
    <img
      src={src ?? ""}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
      className={fill ? `absolute inset-0 h-full w-full ${className ?? ""}` : className}
      style={style}
    />
  );

  // fill: logo sits centered behind, real image overlays it (transparent until
  // loaded, removed on error) so the logo is the placeholder/fallback.
  // non-fill: the element is sized by its own className, so we can't stack —
  // swap to the logo only when there's no usable image.
  const content = fill ? (
    <span className="absolute inset-0 flex items-center justify-center">
      {logo}
      {showReal && real}
    </span>
  ) : showReal ? (
    real
  ) : (
    <img src={FALLBACK} alt={alt} className={className} style={style} />
  );
  /* eslint-enable @next/next/no-img-element */

  if (!href) return content;

  return href.startsWith("/") ? (
    <Link href={href} onClick={onClick}>
      {content}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noreferrer" onClick={onClick}>
      {content}
    </a>
  );
}
