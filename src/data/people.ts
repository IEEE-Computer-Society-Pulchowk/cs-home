import type { Person } from "@/types";

const person = (
  id: string,
  name: string,
  membership: number,
  details: Omit<Person, "id" | "name" | "membership"> = {}
): Person => ({
  id,
  name,
  membership,
  ...details,
});


export const PEOPLE: Record<string, Person> = {
  // "RollNo": person("RollNo", "Name", 0, {}), // Use this template to add new people
  "PUL080BCT003": person("PUL080BCT003", "Aakrisht Sharma Paudel", 101381000, {
    imageUrl: "/people/PUL080BCT003.png",
    linkedin: "https://www.linkedin.com/in/aakrisht-sharma-paudel/",
    github: "https://github.com/AakrishtSP",
    instagram: "https://www.instagram.com/aakrishtsp/",
  }),
  "PUL080BCT049": person("PUL080BCT049", "Nirdesh Timilsina", 100835080, {
    imageUrl: "/people/PUL080BCT049.png",
    linkedin: "https://www.linkedin.com/in/nirdeshtimilsina/",
    github: "https://github.com/Nirdesh-Timilsina",
    instagram: "https://www.instagram.com/nirdeshtimilsina/",
  }),
  "PUL079BCT075": person("PUL079BCT075", "Sakar KC", 101333973, {
    linkedin: "https://www.linkedin.com/in/kcsakar",
    github: "https://github.com/void-33",
  }),
  "PUL079BCT093": person("PUL079BCT093", "Utsav Acharya", 100314857, {
    linkedin: "https://www.linkedin.com/in/clerisy47/",
    github: "https://github.com/clerisy47",
    instagram: "https://www.instagram.com/clerisy47/",
  }),
  "PUL080BCT008": person("PUL080BCT008", "Abhishek Tharu", 0, {
    linkedin: "https://www.linkedin.com/in/abhishektharu09/",
    instagram: "https://www.instagram.com/_abhichau/",
  }),
  "PUL080BCT062": person("PUL080BCT062", "Prince Rajan Magar", 101381065, {
    linkedin: "https://www.linkedin.com/in/prince-rajan-magar-22586b325",
  }),
  "PUL080BCT065": person("PUL080BCT065", "Rhythm Adhikari", 0, {
    linkedin: "https://www.linkedin.com/in/rhythm-adhikari-1a7843227",
  }),
  "PUL080BCT066": person("PUL080BCT066", "Ritesh Jha", 100858073, {
    instagram: "https://www.instagram.com/riteshjha0823/",
  }),
  "PUL080BCT081": person("PUL080BCT081", "Shristi Pokhrel", 102120049, {
    linkedin: "https://www.linkedin.com/in/shristi-pokhrel-76278333a/",
    github: "https://github.com/Shri-29",
  }),
  "PUL080BCT092": person("PUL080BCT092", "Swarnima Khadka", 101224277, {
    linkedin: "https://www.linkedin.com/in/swarnima-khadka-396a2b313/",
    github: "https://github.com/Swarnima-Khadka1",
  }),
  "PUL081BCT013": person("PUL081BCT013", "Abishek Parajuli", 101478591, {
    linkedin: "https://www.linkedin.com/in/abishek-parajuli-866b89370",
    github: "https://github.com/abishekparajuli-np",
    instagram: "https://www.instagram.com/abishekparajuli_17",
  }),
  "PUL081BCT018": person("PUL081BCT018", "Anup Chaulagain", 102019817, {
    linkedin: "https://www.linkedin.com/in/anup-chaulagain-374ab0337/",
    github: "https://github.com/",
    instagram: "https://www.instagram.com/anupch37/",
  }),
  "PUL081BCT030": person("PUL081BCT030", "Bishleshan Paudel", 102119645, {
    linkedin: "https://www.linkedin.com/in/bishleshan-paudel-600bb8347/",
  }),
  "PUL081BCT044": person("PUL081BCT044", "Nirdesh Joshi", 100846832, {}),
  "PUL081BCT075": person("PUL081BCT075", "Sanskriti Adhikari", 101798557, {
    linkedin: "https://www.linkedin.com/in/sanskriti-adhikari-b7b97937a",
    github: "https://github.com/Sanskriti-Adhikari",
    instagram: "https://www.instagram.com/sanskritiadhikari9/",
  }),
  "PUL081BCT079": person("PUL081BCT079", "Shubha Sandesh Sharma Neupane", 102118226, {}),
  "PUL081BCT082": person("PUL081BCT082", "Subhesh Bhatta", 102119627, {
    linkedin: "https://linkedin.com/in/subhesh-bhatta-b964b735a/",
    github: "https://github.com/Subhesh-Bhatta",
    instagram: "https://www.instagram.com/subhesh.bhatta/",
  }),
  "PUL081BEI044": person("PUL081BEI044", "Suryansu Jha", 102184682, {}),
  "PUL082BCT064": person("PUL082BCT064", "Sajiya Aryal", 102117090, {}),
  "PUL082BCT089": person("PUL082BCT089", "Sujal Pant", 102027107, {
    linkedin: "https://www.linkedin.com/in/sujal-pant-41434a394",
  }),
  "PUL082BEI011": person("PUL082BEI011", "Bhawani Khatri", 0, {}),
  "PUL082BEI023": person("PUL082BEI023", "Manika Poudel", 0, {
    github: "https://github.com/monikapoudel16",
  }),
  "Prabesh-Bastola": person("Prabesh-Bastola", "Prabesh Bastola", 0, {}),
  "Nitesh-Baniya": person("Nitesh-Baniya", "Nitesh Baniya", 0, {}),
  "Prashila-Bhattarai": person("Prashila-Bhattarai", "Prashila Bhattarai", 0, {}),
  "Nischhal-Shrestha": person("Nischhal-Shrestha", "Nischhal Shrestha", 0, {}),
  "Aditya-Shah": person("Aditya-Shah", "Aditya Shah", 0, {}),
  "Tejaswi-Acharya": person("Tejaswi-Acharya", "Tejaswi Acharya", 0, {}),
  "Pratik-Singh-Thapa": person("Pratik-Singh-Thapa", "Pratik Singh Thapa", 0, {}),
  "Tangsep-Chongbang": person("Tangsep-Chongbang", "Tangsep Chongbang", 0, {}),
  "Utsab-Raj-Bhattarai": person("Utsab-Raj-Bhattarai", "Utsab Raj Bhattarai", 0, {}),
  "Janak-Bhatta": person("Janak-Bhatta", "Janak Bhatta", 0, {}),
  "Snigdh-Karki": person("Snigdh-Karki", "Snigdh Karki", 0, {}),
  "Shreyam-Regmi": person("Shreyam-Regmi", "Shreyam Regmi", 0, {}),
  "Sunit-Shrestha": person("Sunit-Shrestha", "Sunit Shrestha", 0, {}),
  "Binay-Kumar-Mandal": person("Binay-Kumar-Mandal", "Binay Kumar Mandal", 0, {}),
  "Vansh-Adhikari": person("Vansh-Adhikari", "Vansh Adhikari", 0, {}),
  "Praharsha-Adhikari": person("Praharsha-Adhikari", "Praharsha Adhikari", 0, {}),
  "Prashansa-Shrestha": person("Prashansa-Shrestha", "Prashansa Shrestha", 0, {}),
  "Aeva-Acharya": person("Aeva-Acharya", "Aeva Acharya", 0, {}),
  "Aarbid-Bhattarai": person("Aarbid-Bhattarai", "Aarbid Bhattarai", 0, {}),
  "Pawan-Kharel": person("Pawan-Kharel", "Pawan Kharel", 0, {}),
  "Asim-Baral": person("Asim-Baral", "Asim Baral", 0, {}),
  "Ishan-Gautam": person("Ishan-Gautam", "Ishan Gautam", 0, {}),
  "Pratyush-Adhikary": person("Pratyush-Adhikary", "Pratyush Adhikary", 0, {}),
  "Susmita-Paudel": person("Susmita-Paudel", "Susmita Paudel", 0, {}),
  "Kushal-Regmi": person("Kushal-Regmi", "Kushal Regmi", 0, {}),
  "Animesh-Dhakal": person("Animesh-Dhakal", "Animesh Dhakal", 0, {
    linkedin: "https://www.linkedin.com/in/animeshdhakal/",
  }),
};

export const PEOPLE_LIST = Object.values(PEOPLE).sort((left, right) =>
  left.name.localeCompare(right.name)
);

export const getPersonById = (personId: string): Person | undefined => PEOPLE[personId];

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

  if (PEOPLE[trimmedLookup]) {
    return trimmedLookup;
  }

  const byMembership = getPersonByMembershipId(trimmedLookup);
  return byMembership?.id;
};

export const getPersonByLookupId = (lookupId: string): Person | undefined => {
  const canonicalId = getCanonicalPersonId(lookupId);
  return canonicalId ? PEOPLE[canonicalId] : undefined;
};

export const getPersonProfilePath = (lookupId: string): string | undefined => {
  const canonicalId = getCanonicalPersonId(lookupId);

  if (!canonicalId) {
    return undefined;
  }

  return `/people/${encodeURIComponent(canonicalId)}`;
};

export const getPersonImageSource = (person: Pick<Person, "id" | "imageUrl">) =>
  person.imageUrl ?? `/people/${person.id}.png`;