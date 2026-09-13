import React from "react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { TeamMember } from "../types";
import Link from "next/link";
import PersonAvatar from "@/components/person-avatar";
import { getPersonPortraitPath, getPersonProfilePath } from "@/data/people";

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
  const profilePath = getPersonProfilePath(member.id);
  const fallbackImage = member.imageUrl ?? getPersonPortraitPath(member.slug);

  const socialLinks = [
    member.linkedin ? { label: "LinkedIn", url: member.linkedin } : null,
    member.github ? { label: "GitHub", url: member.github } : null,
    member.instagram ? { label: "Instagram", url: member.instagram } : null,
  ].filter(Boolean) as Array<{ label: string; url: string }>;

  return (
    <div className="group relative bg-gray-50 rounded-xl hover:shadow-md hover:shadow-ieee-cs-orange/10 transition-shadow duration-200 ease-out flex flex-col overflow-hidden h-full">
      {/* Image / Placeholder */}
      <div className="p-4 pb-0">
        <PersonAvatar
          src={fallbackImage}
          alt={member.name}
          id={member.id}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="relative w-full h-64 sm:h-72"
        />
      </div>

      <div className="p-5 flex flex-col items-center text-center grow">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-black transition-colors duration-200">
          <Link href={profilePath ?? "#"}>
            {member.name}
          </Link>
        </h3>
        {member.role && (
          <p className="text-gray-500 text-sm font-medium mt-1 mb-3">
            {member.role}
          </p>
        )}

        {socialLinks.length > 0 && (
          <div className="mt-auto pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 transition-[opacity,translate] duration-200 ease-out pointer-fine:translate-y-2 pointer-fine:group-hover:translate-y-0 flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = getSocialIcon(social.label);

              return (
                <a
                  key={`${social.label}-${social.url}`}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-gray-400 hover:text-black transition-colors"
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
