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
  width?: number;
  height?: number;
  sizes?: string;
  onClick?: (e: React.MouseEvent) => void;
  loading?: "lazy" | "eager";
  style?: React.CSSProperties;
}

const DEFAULT_FALLBACK = "/logo-orange.svg";

type SmartImgProps = {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  onLoad?: () => void;
  onError?: () => void;
  "aria-hidden"?: boolean;
};

const SmartImg = React.forwardRef<HTMLImageElement, SmartImgProps>(function SmartImg(
  {
    src,
    alt,
    className,
    style,
    fill,
    sizes,
    width,
    height,
    loading,
    onLoad,
    onError,
    "aria-hidden": ariaHidden,
  },
  ref
) {
  const useNextImage = fill || (width !== undefined && height !== undefined);

  if (useNextImage) {
    return (
      <Image
        ref={ref}
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        className={className}
        style={style}
        loading={loading}
        onLoad={onLoad}
        onError={onError}
        aria-hidden={ariaHidden}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onLoad={onLoad}
      onError={onError}
      aria-hidden={ariaHidden}
    />
  );
});

export default function SmartImage({
  src,
  alt,
  href,
  className,
  fill = false,
  width,
  height,
  sizes,
  onClick,
  loading = "lazy",
  style,
}: SmartImageProps) {
  const isLogo =
    typeof src === "string" &&
    (src === "/logo-orange.svg" || src === "/logo-white.svg" || src.endsWith(".svg"));

  const [ready, setReady] = React.useState(isLogo);
  const [failed, setFailed] = React.useState(false);

  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const nextIsLogo =
      typeof src === "string" &&
      (src === "/logo-orange.svg" || src === "/logo-white.svg" || src.endsWith(".svg"));

    if (nextIsLogo) {
      setReady(true);
      setFailed(false);
    } else if (imgRef.current?.complete) {
      setReady(true);
      setFailed(false);
    } else {
      setReady(false);
      setFailed(false);
    }
  }, [src]);

  const imageElement = fill ? (
    <div style={{ position: "absolute", inset: 0 }}>
      {src && !failed && (
        <SmartImg
          ref={imgRef}
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

      {!ready && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
          }}
        >
          <SmartImg
            src={DEFAULT_FALLBACK}
            alt={alt || ""}
            style={{
              width: "6rem",
              height: "6rem",
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
      <div style={{ position: "relative", display: "contents" }}>
        {src && !failed && (
          <SmartImg
            ref={imgRef}
            src={src}
            alt={alt || ""}
            width={width}
            height={height}
            className={className}
            style={
              ready
                ? (style ?? {})
                : { ...style, position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }
            }
            onLoad={() => setReady(true)}
            onError={() => setFailed(true)}
            loading={loading}
          />
        )}

        {!ready && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              minHeight: "inherit",
              backgroundColor: "transparent",
            }}
          >
            <SmartImg
              src={DEFAULT_FALLBACK}
              alt={alt || ""}
              style={{
                width: "6rem",
                height: "6rem",
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
