import React from "react";
import Link from "next/link";
import SmartImage from "@/components/smart-image";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="mb-4">
              <Link href="/">
                <SmartImage
                  src="/logo-white.svg"
                  alt="IEEE PSB Logo"
                  className="h-12 w-auto object-contain brightness-0 invert opacity-90"
                />
              </Link>
            </div>
            <p className="text-sm leading-relaxed opacity-80 max-w-xs">
              Advancing Excellence in Computing and Technology. The student
              branch of IEEE Computer Society at Pulchowk Campus, dedicated to
              technical excellence and community growth.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-white transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="hover:text-white transition-colors"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <a
                  href="https://www.ieee.org"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  IEEE.org
                </a>
              </li>
              <li>
                <a
                  href="https://www.computer.org"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Computer.org
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt
                  size={18}
                  className="text-ieee-cs-orange mt-0.5"
                />
                <span>Pulchowk Campus, Lalitpur, Nepal</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope size={18} className="text-ieee-cs-orange" />
                <a
                  href="mailto:ieeecs@pcampus.edu.np"
                  className="hover:text-white transition-colors"
                >
                  ieeecs@pcampus.edu.np
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a
                href="https://www.facebook.com/pulchowkcompsbc"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/ieee-compsbc-pulchowk/"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/ieeecs.pul/"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} IEEE Computer Society Pulchowk
            SBC. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
