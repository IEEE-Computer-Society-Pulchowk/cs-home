"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface SmartImageProps {
  src?: string | null;
  alt?: string;
  href?: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  onClick?: (e: React.MouseEvent) => void;
  loading?: "lazy" | "eager";
  style?: React.CSSProperties;
}

const DEFAULT_FALLBACK = "/logo-orange.svg";

export default function SmartImage({
  src,
  alt,
  href,
  className,
  fill = false,
  sizes,
  onClick,
  loading = "lazy",
  style,
}: SmartImageProps) {
  // If the image is a local logo or SVG, we consider it instantly ready to prevent caching onLoad bugs
  const isLogo = typeof src === "string" && (src === "/logo-orange.svg" || src === "/logo-white.svg" || src.endsWith(".svg"));

  // Start with fallback; flip to true only after real image confirms loaded
  const [ready, setReady] = React.useState(isLogo);
  const [failed, setFailed] = React.useState(false);

  const imgRef = React.useRef<HTMLImageElement>(null);

  // Reset when src changes
  React.useEffect(() => {
    const nextIsLogo = typeof src === "string" && (src === "/logo-orange.svg" || src === "/logo-white.svg" || src.endsWith(".svg"));
    setReady(nextIsLogo);
    setFailed(false);
  }, [src]);

  // Check if standard image is already loaded from cache when mounted
  React.useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setReady(true);
    }
  }, [src]);

  const imageElement = fill ? (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Real image: fetches in background, shown only when loaded */}
      {src && !failed && (
        <Image
          src={src}
          alt={alt || ""}
          fill
          sizes={sizes}
          className={className}
          style={ready ? (style ?? {}) : { ...style, opacity: 0, pointerEvents: "none" }}
          onLoad={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      )}

      {/* Fallback: visible until real image ready */}
      {!ready && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
        }}>
          <img
            src={DEFAULT_FALLBACK}
            alt={alt || ""}
            style={{
              width: "6rem", // w-24
              height: "6rem", // h-24
              objectFit: "contain",
              opacity: 0.6,
            }}
            aria-hidden
          />
        </div>
      )}
    </div>
  ) : (
    <>
      {/* Wrapper so fallback and real image occupy the same space */}
      <div style={{ position: "relative", display: "contents" }}>
        {/* Real image: fetches in background, shown only when loaded */}
        {src && !failed && (
          <img
            ref={imgRef}
            src={src}
            alt={alt || ""}
            className={className}
            style={ready ? (style ?? {}) : { ...style, position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
            onLoad={() => setReady(true)}
            onError={() => setFailed(true)}
            loading={loading}
          />
        )}

        {/* Fallback: visible until real image ready */}
        {!ready && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            minHeight: "inherit",
            backgroundColor: "transparent",
          }}>
            <img
              src={DEFAULT_FALLBACK}
              alt={alt || ""}
              style={{
                width: "6rem", // w-24
                height: "6rem", // h-24
                objectFit: "contain",
                opacity: 0.6,
              }}
              aria-hidden
            />
          </div>
        )}
      </div>
    </>
  );

  if (!href) return imageElement;

  const isInternal = href.startsWith("/");

  return isInternal ? (
    <Link href={href} onClick={onClick}>
      {imageElement}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noreferrer" onClick={onClick}>
      {imageElement}
    </a>
  );
}