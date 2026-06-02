"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import SmartImage from "@/components/smart-image";
import { NAV_LINKS } from "@/constants";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass = `fixed w-full z-50 transition-all duration-300 ${
    scrolled || isOpen
      ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
      : "bg-transparent py-5"
  }`;

  const textClass = scrolled || isOpen ? "text-gray-800" : "text-white";
  const logoClass = scrolled || isOpen ? "text-ieee-cs-orange" : "text-white";

  // Force dark text on non-home pages if not scrolled, as they might have light backgrounds
  const isHome = pathname === "/";
  const finalTextClass = !isHome && !scrolled ? "text-gray-800" : textClass;
  const finalLogoClass = !isHome && !scrolled ? "text-ieee-cs-orange" : logoClass;
  const finalNavClass =
    !isHome && !scrolled
      ? "fixed w-full z-50 bg-white border-b border-gray-100 py-4 transition-all duration-300"
      : navClass;

  return (
    <nav className={finalNavClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Area */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative h-10 w-auto">
              <SmartImage
                src={isHome && !scrolled && !isOpen ? "/logo-white.svg" : "/logo-orange.svg"}
                alt="IEEE PSB Logo"
                className="h-10 w-auto object-contain transition-opacity duration-300"
              />
            </div>
            {/* <div className="flex flex-col">
              <span
                className={`font-bold text-lg leading-tight tracking-tight ${finalLogoClass}`}
              >
                IEEE PSB
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider opacity-80 ${finalTextClass}`}
              >
                Pulchowk Campus
              </span>
            </div> */}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-ieee-cs-orange ${
                  pathname === link.path
                    ? "opacity-100 font-semibold"
                    : "opacity-80"
                } ${finalTextClass}`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://www.ieee.org/membership/join/index.html"
              target="_blank"
              rel="noreferrer"
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                isHome && !scrolled
                  ? "bg-white text-ieee-cs-orange hover:bg-gray-100"
                  : "bg-ieee-cs-orange text-white hover:bg-ieee-dark"
              }`}
            >
              Join IEEE
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none ${finalTextClass}`}
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-b border-gray-100 py-4 px-4 flex flex-col space-y-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`block text-base font-medium text-gray-800 hover:text-ieee-cs-orange ${
                pathname === link.path ? "text-ieee-cs-orange" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.ieee.org/membership/join/index.html"
            target="_blank"
            rel="noreferrer"
            className="block text-center w-full py-3 bg-ieee-cs-orange text-white rounded-lg font-semibold"
          >
            Join IEEE
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
