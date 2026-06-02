import React from "react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { TeamMember } from "../types";
import Image from "next/image";
import { getPersonImageSource } from "@/data/people";
import Link from "next/link";
import SmartImage from "@/components/smart-image";

interface MemberCardProps {
  member: TeamMember;
}

const getSocialIcon = (label: string) => {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("linkedin")) {
    return FaLinkedin;
  }

  if (normalizedLabel.includes("github")) {
    return FaGithub;
  }

  if (normalizedLabel.includes("instagram")) {
    return FaInstagram;
  }

  return FaLinkedin;
};

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const fallbackImage = getPersonImageSource(member);

  const socialLinks = [
    member.linkedin ? { label: "LinkedIn", url: member.linkedin } : null,
    member.github ? { label: "GitHub", url: member.github } : null,
    member.instagram ? { label: "Instagram", url: member.instagram } : null,
  ].filter(Boolean) as Array<{ label: string; url: string }>;

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-ieee-cs-orange/30 transition-all duration-300 flex flex-col overflow-hidden h-full">
      {/* Image / Placeholder */}
      <div className="relative w-full h-64 sm:h-72 bg-gray-50 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
          <SmartImage
            src={fallbackImage}
            alt={member.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            href={`/people/${encodeURIComponent(member.id)}`}
            className="object-contain"
          />
        </div>
      </div>

      <div className="p-5 flex flex-col items-center text-center flex-grow">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-ieee-cs-orange transition-colors duration-200">
          <Link href={`/people/${encodeURIComponent(member.id)}`}>
            {member.name}
          </Link>
        </h3>
        {member.role && (
          <p className="text-ieee-cs-orange/80 text-sm font-medium mt-1 mb-3">
            {member.role}
          </p>
        )}

        {socialLinks.length > 0 && (
          <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = getSocialIcon(social.label);

              return (
                <a
                  key={`${social.label}-${social.url}`}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-gray-400 hover:text-amber-700 transition-colors"
                  aria-label={`${social.label} profile of ${member.name}`}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
