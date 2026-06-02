import { notFound, redirect } from "next/navigation";
import {
  PEOPLE_LIST,
  getPersonByMembershipId,
  getPersonProfilePath,
} from "@/data/people";

export async function generateStaticParams() {
  return PEOPLE_LIST.filter((person) => person.membership > 100).map((person) => ({
    id: String(person.membership),
  }));
}

export default async function PersonMembershipRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = getPersonByMembershipId(id);

  if (!person) {
    notFound();
  }

  const profilePath = getPersonProfilePath(person.id);

  if (!profilePath) {
    notFound();
  }

  redirect(profilePath);
}
