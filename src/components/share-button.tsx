"use client";

import React, { useState, useEffect } from "react";
import { FaShareAlt, FaCheck } from "react-icons/fa";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy URL: ", err);
    }
  };

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      onClick={handleShare}
      className={`transition-all duration-300 p-2 rounded-full flex items-center justify-center ${
        copied
          ? "text-emerald-600 bg-emerald-50 scale-110"
          : "text-gray-400 hover:text-ieee-cs-orange hover:bg-amber-50"
      }`}
      title={copied ? "Copied to clipboard!" : "Share article"}
      aria-label="Share article"
    >
      {copied ? (
        <FaCheck size={20} className="transition-transform duration-200" />
      ) : (
        <FaShareAlt size={20} />
      )}
    </button>
  );
}
