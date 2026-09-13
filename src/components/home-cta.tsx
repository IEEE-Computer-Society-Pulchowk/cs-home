import React from "react";
import { FaUsers, FaExternalLinkAlt } from "react-icons/fa";
import Reveal from "@/components/reveal";

const HomeCTA: React.FC = () => {
  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-ieee-cs-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" aria-hidden="true"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-ieee-cs-orange/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" aria-hidden="true"></div>

      <Reveal delay={80}>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ieee-cs-orange text-black shadow-lg shadow-ieee-cs-orange/20 mb-6">
            <FaUsers size={24} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Shape the Future?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Join a global network of professionals and students. Enhance your
            skills, expand your network, and contribute to technological
            advancement.
          </p>
          <a
            href="https://www.ieee.org/membership/join/index.html"
            target="_blank"
            rel="noreferrer"
            title="Opens in a new tab"
            className="inline-flex items-center gap-2 px-8 py-4 bg-ieee-cs-orange text-black rounded-full font-bold shadow-lg shadow-ieee-cs-orange/20 hover:bg-amber-400 transition-[translate,scale,background-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
          >
            Become a Member
            <FaExternalLinkAlt size={16} className="opacity-70" />
          </a>
        </div>
      </Reveal>
    </section>
  );
};

export default HomeCTA;