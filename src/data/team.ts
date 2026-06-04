import type { TeamCommittee, TeamMember, TeamYear } from "@/types";
import { getPersonById, getPersonBySlug } from "@/data/people";

const member = (personSlug: string, role: string, sort: number) => {
  const person = getPersonBySlug(personSlug.toLowerCase());
  if (!person) throw console.log(`No person found for slug: "${personSlug}"`);
  return { personId: person.id, role, sort };
};

const committee = (
  id: string,
  title: string,
  sort: number,
  members: TeamCommittee["members"]
): TeamCommittee => ({
  id,
  title,
  sort,
  members,
});

export const TEAM_YEARS: TeamYear[] = [
  {
    year: "2026",
    sort: 2026,
    committees: [
      committee("officers", "Officers", 10, [
        member("nirdesh-timilsina", "Chair", 10),
        member("sakar-kc", "Vice Chair", 20),
        member("swarnima-khadka", "Secretary", 30),
        member("sanskriti-adhikari", "Vice Secretary", 40),
        member("aakrisht-sharma-paudel", "Web Master", 50),
        member("prabesh-bastola", "Treasurer", 60),
      ]),
      committee("activity", "Activity Committee", 20, [
        member("prince-rajan-magar", "Coordinator", 10),
        member("abishek-parajuli", "Executive Member", 20),
        member("nirdesh-joshi", "Executive Member", 30),
        member("shristi-pokhrel", "Executive Member", 40),
        member("subhesh-bhatta", "Executive Member", 50),
        member("shubha-sandesh-sharma-neupane", "Executive Member", 60),
      ]),
      committee("graphics", "Graphics Committee", 30, [
        member("nitesh-baniya", "Coordinator", 10),
        member("ritesh-jha", "Executive Member", 20),
        member("anup-chaulagain", "Executive Member", 30),
        member("prashila-bhattarai", "Executive Member", 40),
        member("sujal-pant", "Executive Member", 50),
        member("abhishek-tharu", "Executive Member", 60),
        member("nischhal-shrestha", "Executive Member", 70),
      ]),
      committee("media", "Media, Video & Photography Committee", 40, [
        member("aditya-shah", "Video Editing Lead", 10),
        member("suryansu-jha", "Media Coordinator", 20),
        member("tejaswi-acharya", "Media Coordinator", 30),
        member("pratik-singh-thapa", "Photography Lead", 40),
      ]),
      committee("external-relations", "External Relation Committee", 50, [
        member("bishleshan-paudel", "Coordinator", 10),
        member("tangsep-chongbang", "Executive Member", 20),
        member("sajiya-aryal", "Executive Member", 30),
        member("utsab-raj-bhattarai", "Executive Member", 40),
        member("janak-bhatta", "Video Editing Executive Member", 50),
      ]),
      committee("research-development", "R&D Committee", 60, [
        member("snigdh-karki", "Coordinator", 10),
        member("rhythm-adhikari", "Executive Member", 20),
        member("shreyam-regmi", "Executive Member", 30),
        member("sunit-shrestha", "Executive Member", 40),
      ]),
      committee("volunteer-members", "Volunteer Members", 70, [
        member("bhawani-khatri", "Volunteer", 10),
        member("manika-poudel", "Volunteer", 20),
        member("binay-kumar-mandal", "Volunteer", 30),
        member("vansh-adhikari", "Volunteer", 40),
      ]),
      committee("senior-executives", "Senior Executives", 80, [
        member("utsav-acharya", "Senior Executive", 0),
        member("praharsha-adhikari", "Senior Executive", 10),
        member("prashansa-shrestha", "Senior Executive", 20),
        member("aeva-acharya", "Senior Executive", 30),
      ]),
    ],
  },
  {
    year: "2025",
    sort: 2025,
    committees: [
      committee("committee", "Officers", 10, [
        member("aarbid-bhattarai", "Chair", 10),
        member("praharsha-adhikari", "Vice Chair", 20),
        member("pawan-kharel", "Secretary", 30),
        member("nirdesh-timilsina", "Vice Secretary", 40),
        member("utsav-acharya", "Web Master", 50),
        member("asim-baral", "Treasurer", 60),
      ]),
      committee("executive-members", "Executive Members", 20, [
        member("sakar-kc", "Executive Member", 70),
        member("suryansu-jha", "Executive Member", 80),
        member("aditya-shah", "Executive Member", 90),
        member("prabesh-bastola", "Executive Member", 100),
        member("janak-bhatta", "Executive Member", 110),
        member("swarnima-khadka", "Executive Member", 120),
        member("ishan-gautam", "Executive Member", 130),
        member("pratyush-adhikary", "Executive Member", 140),
        member("rhythm-adhikari", "Executive Member", 150),
        member("aakrisht-sharma-paudel", "Executive Member", 160),
        member("susmita-paudel", "Executive Member", 170),
        member("prince-rajan-magar", "Executive Member", 180),
        member("kushal-regmi", "Executive Member", 190),
      ]),
    ],
  },
];

export const SORTED_TEAM_YEARS = [...TEAM_YEARS].sort(
  (left, right) => right.sort - left.sort
);

export const getTeamYear = (year: string) =>
  TEAM_YEARS.find((entry) => entry.year === year);

export const resolveCommittee = (committee: TeamCommittee) => ({
  ...committee,
  members: [...committee.members]
    .sort((left, right) => {
      const sortDifference = (left.sort ?? 0) - (right.sort ?? 0);

      if (sortDifference !== 0) {
        return sortDifference;
      }

      const leftPerson = getPersonById(left.personId);
      const rightPerson = getPersonById(right.personId);

      return (leftPerson?.name ?? "").localeCompare(rightPerson?.name ?? "");
    })
    .map((membership) => {
      const person = getPersonById(membership.personId);

      if (!person) {
        throw new Error(`Missing person record for ${membership.personId}`);
      }

      return {
        ...person,
        role: membership.role,
      } satisfies TeamMember;
    }),
});

export const resolveTeamYear = (year: TeamYear) => ({
  ...year,
  committees: [...year.committees]
    .sort((left, right) => {
      const sortDifference = left.sort - right.sort;

      if (sortDifference !== 0) {
        return sortDifference;
      }

      return left.title.localeCompare(right.title);
    })
    .map(resolveCommittee),
});

export interface PersonTeamRole {
  year: string;
  role: string;
  committeeId: string;
  committeeTitle: string;
}

export const getPersonTeamRoles = (personId: string): PersonTeamRole[] =>
  [...TEAM_YEARS]
    .sort((left, right) => right.sort - left.sort)
    .flatMap((year) =>
      year.committees.flatMap((committee) =>
        committee.members
          .filter((membership) => membership.personId === personId)
          .map((membership) => ({
            year: year.year,
            role: membership.role,
            committeeId: committee.id,
            committeeTitle: committee.title,
            committeeSort: committee.sort,
            memberSort: membership.sort ?? 0,
          }))
      )
    )
    .sort((left, right) => {
      const yearDifference = Number(right.year) - Number(left.year);

      if (yearDifference !== 0) {
        return yearDifference;
      }

      const committeeSortDifference = left.committeeSort - right.committeeSort;

      if (committeeSortDifference !== 0) {
        return committeeSortDifference;
      }

      return left.memberSort - right.memberSort;
    })
    .map(({ year, role, committeeId, committeeTitle }) => ({
      year,
      role,
      committeeId,
      committeeTitle,
    }));

export const getPersonPrimaryTeamRole = (
  personId: string
): PersonTeamRole | undefined => {
  return getPersonTeamRoles(personId)[0];
};