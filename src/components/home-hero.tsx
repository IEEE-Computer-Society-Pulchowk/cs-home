"use client";

import React from "react";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";

const HomeHero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-ieee-dark">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-ieee-dark/20 to-ieee-dark/90 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div>
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-900/30 backdrop-blur-md">
            <span className="text-amber-200 text-xs font-medium tracking-widest uppercase">
              IEEE Computer Society Pulchowk SBC
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
            Advancing Excellence
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-200 to-amber-400">
              in Computing and Technology
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Connecting students, professionals, and visionaries to
            foster technological innovation and excellence in Nepal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://www.ieee.org/membership/join/index.html"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-ieee-cs-orange text-white rounded-full font-semibold hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-amber-500/25 flex items-center justify-center"
            >
              Join IEEE
            </a>
            <Link
              href="/events"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center group"
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
