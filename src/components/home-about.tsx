"use client";

import React from "react";
import { FaArrowRight, FaUsers, FaCalendarCheck, FaSitemap, FaNetworkWired } from "react-icons/fa";
import Link from "next/link";
import Reveal from "@/components/reveal";

const HomeAbout: React.FC = () => {
  return (
    <section className="py-24 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight flex items-center">
              <span className="w-2 h-8 bg-ieee-cs-orange rounded-full mr-3" aria-hidden="true"></span>
              Who We Are
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              IEEE Computer Society Pulchowk SBC is a community of tech enthusiasts,
              researchers, and innovators. We strive to bridge the gap between
              academic learning and industry standards through workshops,
              seminars, and projects.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              As part of the world&apos;s largest technical professional
              organization, we provide our members access to cutting-edge
              information, networking opportunities, and career development
              resources.
            </p>
            <Link
              href="/team"
              className="text-black font-semibold hover:underline inline-flex items-center"
            >
              Meet the Team <FaArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: FaCalendarCheck, label: "Events Hosted", value: "10+" },
              { icon: FaUsers, label: "Team Members", value: "40+" },
              { icon: FaSitemap, label: "Active Committees", value: "8" },
              { icon: FaNetworkWired, label: "Members Networked", value: "45+" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center hover:border-ieee-cs-orange/30 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ieee-cs-orange/15 text-black mb-4">
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
};

export default HomeAbout;
