"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaExternalLinkAlt } from "react-icons/fa";
import SmartImage from "@/components/smart-image";
import { NAV_LINKS } from "@/constants";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const floatOverHero = isHome && !scrolled && !isOpen;
  const navClass = `fixed w-full z-50 transition-[padding,background-color,box-shadow,border-color] duration-300 ease-out ${
    floatOverHero
      ? "bg-transparent py-5"
      : "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
  }`;

  const textClass = "text-gray-900";

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          {/* Logo Area */}
          {!floatOverHero && (
            <Link href="/" className="flex items-center space-x-2 group animate-logo-in">
              <div className="relative h-10 w-auto">
                <SmartImage
                  src="/IEEE-CS_Logo.webp"
                  alt="IEEE PSB Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
            </Link>
          )}

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center ml-auto">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                href={link.path}
className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-black ${textClass} ${
                  pathname === link.path
                    ? "text-black font-semibold"
                    : "opacity-60"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!floatOverHero && (
              <a
                href="https://www.ieee.org/membership/join/index.html"
                target="_blank"
                rel="noreferrer"
                title="Opens in a new tab"
                className="px-5 py-2 rounded-full text-sm font-semibold transition-[scale,background-color] duration-200 ease-out hover:scale-105 active:scale-[0.97] bg-ieee-cs-orange text-black hover:bg-amber-400"
              >
                Become a Member{" "}
                <FaExternalLinkAlt size={12} className="inline mb-0.5 ml-1 opacity-80" />
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              className={textClass}
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-b border-gray-100 py-4 px-4 flex flex-col space-y-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`block text-base font-medium text-gray-800 hover:text-black ${
                pathname === link.path ? "text-black font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.ieee.org/membership/join/index.html"
            target="_blank"
            rel="noreferrer"
            title="Opens in a new tab"
            className="block text-center w-full py-3 bg-ieee-cs-orange text-black rounded-lg font-semibold hover:bg-amber-400"
          >
            Become a Member{" "}
            <FaExternalLinkAlt size={12} className="inline mb-0.5 ml-1 opacity-80" />
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
