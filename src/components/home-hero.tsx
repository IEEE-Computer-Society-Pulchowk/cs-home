"use client";

import React from "react";
import { FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";
import SmartImage from "@/components/smart-image";

const HomeHero: React.FC = () => {
  return (
    <section className="relative bg-white min-h-dvh flex items-center justify-center overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-ieee-cs-orange/10 blur-3xl" aria-hidden="true"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div>
          <div className="flex justify-center mb-8">
            <SmartImage
              src="/IEEE-CS_Logo.webp"
              alt="IEEE Computer Society Pulchowk SBC"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-tight mb-8">
            Advancing Excellence
            <br />
            in Computing and Technology
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connecting students, professionals, and visionaries to
            foster technological innovation and excellence in Nepal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://www.ieee.org/membership/join/index.html"
              target="_blank"
              rel="noreferrer"
              title="Opens in a new tab"
              className="w-full sm:w-auto px-8 py-3.5 bg-ieee-cs-orange text-black rounded-full font-semibold shadow-lg shadow-ieee-cs-orange/30 hover:bg-amber-400 transition-[scale,background-color,box-shadow] duration-200 ease-out flex items-center justify-center active:scale-[0.97]"
            >
              Become a Member{" "}
              <FaExternalLinkAlt size={14} className="inline ml-2 opacity-80" />
            </a>
            <Link
              href="/events"
              className="w-full sm:w-auto px-8 py-3.5 border border-gray-300 text-gray-900 rounded-full font-semibold hover:border-ieee-cs-orange/60 hover:bg-ieee-cs-orange/10 transition-[scale,background-color,border-color] duration-200 ease-out flex items-center justify-center group active:scale-[0.97]"
            >
              Explore Events{" "}
              <FaChevronRight
                size={18}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
