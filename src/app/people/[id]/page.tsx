import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { PEOPLE_LIST, getPersonBySlug } from "@/data/people";
import { getPersonTeamRoles } from "@/data/team";
import PersonAvatar from "@/components/person-avatar";

export async function generateStaticParams() {
  return PEOPLE_LIST.map((person) => ({ id: person.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const person = getPersonBySlug(id);

  if (!person) {
    return {
      title: "Person Not Found",
    };
  }

  return {
    title: `${person.name} | People`,
    description: `Profile for ${person.name}.`,
  };
}

export default async function PersonProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = getPersonBySlug(id);

  if (!person) {
    notFound();
  }

  const roles = getPersonTeamRoles(person.id);
  const imageSrc = person.imageUrl;

  const socials = [
    person.linkedin
      ? { label: "LinkedIn", href: person.linkedin, icon: FaLinkedin }
      : null,
    person.github ? { label: "GitHub", href: person.github, icon: FaGithub } : null,
    person.instagram
      ? { label: "Instagram", href: person.instagram, icon: FaInstagram }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    href: string;
    icon: typeof FaLinkedin;
  }>;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href="/team"
          className="inline-flex items-center text-sm text-gray-500 hover:text-ieee-cs-orange mb-8"
        >
          Back to Team
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-start">
            <PersonAvatar
              src={imageSrc}
              alt={person.name}
              id={person.id}
              sizes="(max-width: 768px) 70vw, 220px"
              className="relative w-full max-w-55 aspect-square"
              isClickable={false}
            />

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {person.name}
              </h1>
              {/*<p className="text-sm text-gray-500 mb-4">ID: {person.id}</p>*/}

              {person.membership && person.membership > 100 && (
                <p className="text-sm text-gray-600 mb-2">
                  Membership ID: {person.membership}
                </p>
              )}

              {roles.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-ieee-cs-orange mb-3">
                    Roles
                  </p>
                  <div className="flex flex-col gap-2">
                    {roles.map((role) => (
                      <p key={`${role.year}-${role.committeeId}-${role.role}`} className="text-sm text-gray-700">
                        {role.role} • {role.committeeTitle} ({role.year})
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {socials.length > 0 && (
                <div className="flex items-center gap-3">
                  {socials.map((social) => {
                    const Icon = social.icon;

                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:text-ieee-cs-orange hover:border-ieee-cs-orange/30 transition-colors"
                        aria-label={`${social.label} profile of ${person.name}`}
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
