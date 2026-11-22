"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Bot } from "lucide-react";

interface SmartImageProps extends Omit<ImageProps, "onError"> {
  fallbackText?: string;
}

export function SmartImage({
  src,
  alt,
  fallbackText,
  className,
  fill,
  ...props
}: SmartImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-surface-alt border border-hairline text-ink-2 p-4 text-center ${className || ""} ${
          fill ? "absolute inset-0 w-full h-full" : ""
        }`}
      >
        <div className="w-9 h-9 rounded-full bg-primary-soft text-primary flex items-center justify-center mb-2">
          <Bot className="w-5 h-5" />
        </div>
        <span className="text-xs font-semibold text-ink line-clamp-2">
          {fallbackText || alt || "ARSA Event Poster"}
        </span>
        <span className="text-[10px] text-ink-3 mt-1 uppercase tracking-wider">
          Dept. of Automation & Robotics • JSPM RSCOE
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
