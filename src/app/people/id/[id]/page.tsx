import { notFound, redirect } from "next/navigation";
import {
  getPersonById,
  getPersonIdStaticParams,
  getPersonProfilePath,
} from "@/data/people";

export async function generateStaticParams() {
  return getPersonIdStaticParams();
}

export default async function PersonIdRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = getPersonById(id);

  if (!person) {
    notFound();
  }

  const profilePath = getPersonProfilePath(person.id);

  if (!profilePath) {
    notFound();
  }

  redirect(profilePath);
}
