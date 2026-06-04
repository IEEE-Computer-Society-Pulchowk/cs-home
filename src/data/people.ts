import type { Person } from "@/types";

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export const getPersonPortraitPath = (slug: string, ext = "png") =>
  `/people/${slug}.${ext}`;

function buildPeople<
  T extends Record<
    string,
    Omit<Person, "id" | "slug" | "imageUrl"> & { slug?: string; imageUrl?: string }
  >
>(data: T): Record<keyof T, Person> & Record<string, Person> {
  return Object.fromEntries(
    Object.entries(data).map(([id, { slug, imageUrl, ...rest }]) => {
      const personSlug = slug ?? toSlug(rest.name);

      return [
        id,
        {
          id,
          slug: personSlug,
          imageUrl: imageUrl ?? getPersonPortraitPath(personSlug),
          ...rest,
        } as Person,
      ];
    })
  ) as Record<keyof T, Person> & Record<string, Person>;
}

export const PEOPLE = buildPeople({
  "PUL080BCT003": {
    name: "Aakrisht Sharma Paudel",
    membership: 101381000,
    linkedin: "https://www.linkedin.com/in/aakrisht-sharma-paudel/",
    github: "https://github.com/AakrishtSP",
    instagram: "https://www.instagram.com/aakrishtsp/",
  },
  "PUL080BCT049": {
    name: "Nirdesh Timilsina",
    membership: 100835080,
    linkedin: "https://www.linkedin.com/in/nirdeshtimilsina/",
    github: "https://github.com/Nirdesh-Timilsina",
    instagram: "https://www.instagram.com/nirdeshtimilsina/",
  },
  "PUL079BCT075": {
    name: "Sakar KC",
    membership: 101333973,
    linkedin: "https://www.linkedin.com/in/kcsakar",
    github: "https://github.com/void-33",
  },
  "PUL079BCT093": {
    name: "Utsav Acharya",
    membership: 100314857,
    linkedin: "https://www.linkedin.com/in/clerisy47/",
    github: "https://github.com/clerisy47",
    instagram: "https://www.instagram.com/clerisy47/",
  },
  "PUL080BCT008": {
    name: "Abhishek Tharu",
    linkedin: "https://www.linkedin.com/in/abhishektharu09/",
    instagram: "https://www.instagram.com/_abhichau/",
  },
  "PUL080BCT062": {
    name: "Prince Rajan Magar",
    membership: 101381065,
    linkedin: "https://www.linkedin.com/in/prince-rajan-magar-22586b325",
  },
  "PUL080BCT065": {
    name: "Rhythm Adhikari",
    linkedin: "https://www.linkedin.com/in/rhythm-adhikari-1a7843227",
  },
  "PUL080BCT066": {
    name: "Ritesh Jha",
    membership: 100858073,
    instagram: "https://www.instagram.com/riteshjha0823/",
  },
  "PUL080BCT081": {
    name: "Shristi Pokhrel",
    membership: 102120049,
    linkedin: "https://www.linkedin.com/in/shristi-pokhrel-76278333a/",
    github: "https://github.com/Shri-29",
  },
  "PUL080BCT092": {
    name: "Swarnima Khadka",
    membership: 101224277,
    linkedin: "https://www.linkedin.com/in/swarnima-khadka-396a2b313/",
    github: "https://github.com/Swarnima-Khadka1",
  },
  "PUL081BCT013": {
    name: "Abishek Parajuli",
    membership: 101478591,
    linkedin: "https://www.linkedin.com/in/abishek-parajuli-866b89370",
    github: "https://github.com/abishekparajuli-np",
    instagram: "https://www.instagram.com/abishekparajuli_17",
  },
  "PUL081BCT018": {
    name: "Anup Chaulagain",
    membership: 102019817,
    linkedin: "https://www.linkedin.com/in/anup-chaulagain-374ab0337/",
    github: "https://github.com/",
    instagram: "https://www.instagram.com/anupch37/",
  },
  "PUL081BCT030": {
    name: "Bishleshan Paudel",
    membership: 102119645,
    linkedin: "https://www.linkedin.com/in/bishleshan-paudel-600bb8347/",
  },
  "PUL081BCT044": {
    name: "Nirdesh Joshi",
    membership: 100846832,
  },
  "PUL081BCT075": {
    name: "Sanskriti Adhikari",
    membership: 101798557,
    linkedin: "https://www.linkedin.com/in/sanskriti-adhikari-b7b97937a",
    github: "https://github.com/Sanskriti-Adhikari",
    instagram: "https://www.instagram.com/sanskritiadhikari9/",
  },
  "PUL081BCT079": {
    name: "Shubha Sandesh Sharma Neupane",
    membership: 102118226,
  },
  "PUL081BCT082": {
    name: "Subhesh Bhatta",
    membership: 102119627,
    linkedin: "https://linkedin.com/in/subhesh-bhatta-b964b735a/",
    github: "https://github.com/Subhesh-Bhatta",
    instagram: "https://www.instagram.com/subhesh.bhatta/",
  },
  "PUL081BEI044": {
    name: "Suryansu Jha",
    membership: 102184682,
  },
  "PUL082BCT064": {
    name: "Sajiya Aryal",
    membership: 102117090,
  },
  "PUL082BCT089": {
    name: "Sujal Pant",
    membership: 102027107,
    linkedin: "https://www.linkedin.com/in/sujal-pant-41434a394",
  },
  "PUL082BEI011": {
    name: "Bhawani Khatri",
  },
  "PUL082BEI023": {
    name: "Manika Poudel",
    github: "https://github.com/monikapoudel16",
  },
  "Prabesh-Bastola": {
    name: "Prabesh Bastola",
  },
  "Nitesh-Baniya": {
    name: "Nitesh Baniya",
  },
  "Prashila-Bhattarai": {
    name: "Prashila Bhattarai",
  },
  "Nischhal-Shrestha": {
    name: "Nischhal Shrestha",
  },
  "Aditya-Shah": {
    name: "Aditya Shah",
  },
  "Tejaswi-Acharya": {
    name: "Tejaswi Acharya",
  },
  "Pratik-Singh-Thapa": {
    name: "Pratik Singh Thapa",
  },
  "Tangsep-Chongbang": {
    name: "Tangsep Chongbang",
  },
  "Utsab-Raj-Bhattarai": {
    name: "Utsab Raj Bhattarai",
  },
  "Janak-Bhatta": {
    name: "Janak Bhatta",
  },
  "Snigdh-Karki": {
    name: "Snigdh Karki",
  },
  "Shreyam-Regmi": {
    name: "Shreyam Regmi",
  },
  "Sunit-Shrestha": {
    name: "Sunit Shrestha",
  },
  "Binay-Kumar-Mandal": {
    name: "Binay Kumar Mandal",
  },
  "Vansh-Adhikari": {
    name: "Vansh Adhikari",
  },
  "Praharsha-Adhikari": {
    name: "Praharsha Adhikari",
  },
  "Prashansa-Shrestha": {
    name: "Prashansa Shrestha",
  },
  "Aeva-Acharya": {
    name: "Aeva Acharya",
  },
  "Aarbid-Bhattarai": {
    name: "Aarbid Bhattarai",
  },
  "Pawan-Kharel": {
    name: "Pawan Kharel",
  },
  "Asim-Baral": {
    name: "Asim Baral",
  },
  "Ishan-Gautam": {
    name: "Ishan Gautam",
  },
  "Pratyush-Adhikary": {
    name: "Pratyush Adhikary",
  },
  "Susmita-Paudel": {
    name: "Susmita Paudel",
  },
  "Kushal-Regmi": {
    name: "Kushal Regmi",
  },
  "Animesh-Dhakal": {
    name: "Animesh Dhakal",
    linkedin: "https://www.linkedin.com/in/animeshdhakal/",
  },
});

export const PEOPLE_LIST = Object.values(PEOPLE).sort((left, right) =>
  left.name.localeCompare(right.name)
);

const resolvePersonId = (personId: string): string | undefined => {
  const trimmed = personId.trim();

  if (!trimmed) {
    return undefined;
  }

  if (PEOPLE[trimmed]) {
    return trimmed;
  }

  const normalized = trimmed.toLowerCase();
  return PEOPLE_LIST.find((person) => person.id.toLowerCase() === normalized)?.id;
};

export const getPersonById = (personId: string): Person | undefined => {
  const canonicalId = resolvePersonId(personId);
  return canonicalId ? PEOPLE[canonicalId] : undefined;
};

export const getPersonIdStaticParams = (): Array<{ id: string }> =>
  PEOPLE_LIST.flatMap((person) => {
    const ids = new Set([person.id, person.id.toLowerCase()]);
    return Array.from(ids, (id) => ({ id }));
  });

export const getPersonBySlug = (slug: string): Person | undefined =>
  PEOPLE_LIST.find((p) => p.slug === slug);

const isMembershipLookupAllowed = (value: number): boolean => value > 100;

export const getPersonByMembershipId = (
  membershipId: number | string
): Person | undefined => {
  const numericMembership =
    typeof membershipId === "number"
      ? membershipId
      : Number.parseInt(membershipId, 10);

  if (!Number.isFinite(numericMembership) || !isMembershipLookupAllowed(numericMembership)) {
    return undefined;
  }

  return PEOPLE_LIST.find((person) => person.membership === numericMembership);
};

export const getCanonicalPersonId = (lookupId: string): string | undefined => {
  const trimmedLookup = lookupId.trim();

  if (!trimmedLookup) {
    return undefined;
  }

  const byId = resolvePersonId(trimmedLookup);
  if (byId) {
    return byId;
  }

  const byMembership = getPersonByMembershipId(trimmedLookup);
  if (byMembership) {
    return byMembership.id;
  }

  const bySlug = getPersonBySlug(trimmedLookup);
  return bySlug?.id;
};

export const getPersonByLookupId = (lookupId: string): Person | undefined => {
  const canonicalId = getCanonicalPersonId(lookupId);
  return canonicalId ? PEOPLE[canonicalId] : undefined;
};

export const getPersonProfilePath = (lookupId: string): string | undefined => {
  const person = getPersonByLookupId(lookupId);

  if (!person) {
    return undefined;
  }

  return `/people/${encodeURIComponent(person.slug)}`;
};