import { getPersonByLookupId, getPersonProfilePath } from "@/data/people";

const PERSON_MENTION_PATTERN = /@\{([^}]+)\}/g;

export const transformPersonMentions = (markdown: string): string => {
  if (!markdown) {
    return markdown;
  }

  return markdown.replace(PERSON_MENTION_PATTERN, (_match, rawId: string) => {
    const mentionId = rawId.trim();
    const person = getPersonByLookupId(mentionId);
    const profilePath = getPersonProfilePath(mentionId);

    if (!person || !profilePath) {
      return `[[INVALID PERSON: ${mentionId}]]`;
    }

    return `[${person.name}](${profilePath})`;
  });
};
