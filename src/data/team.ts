import type { TeamCommittee, TeamMember, TeamYear } from "@/types";
import { getPersonById } from "@/data/people";

const member = (personId: string, role: string, sort: number) => ({
  personId,
  role,
  sort,
});

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
        member("PUL080BCT049", "Chair", 10),
        member("PUL079BCT075", "Vice Chair", 20),
        member("PUL080BCT092", "Secretary", 30),
        member("PUL081BCT075", "Vice Secretary", 40),
        member("PUL080BCT003", "Web Master", 50),
        member("Prabesh-Bastola", "Treasurer", 60),
      ]),
      committee("activity", "Activity Committee", 20, [
        member("PUL080BCT062", "Coordinator", 10),
        member("PUL081BCT013", "Executive Member", 20),
        member("PUL081BCT044", "Executive Member", 30),
        member("PUL080BCT081", "Executive Member", 40),
        member("PUL081BCT082", "Executive Member", 50),
        member("PUL081BCT079", "Executive Member", 60),
      ]),
      committee("graphics", "Graphics Committee", 30, [
        member("Nitesh-Baniya", "Coordinator", 10),
        member("PUL080BCT066", "Executive Member", 20),
        member("PUL081BCT018", "Executive Member", 30),
        member("Prashila-Bhattarai", "Executive Member", 40),
        member("PUL082BCT089", "Executive Member", 50),
        member("PUL080BCT008", "Executive Member", 60),
        member("Nischhal-Shrestha", "Executive Member", 70),
      ]),
      committee("media", "Media, Video & Photography Committee", 40, [
        member("Aditya-Shah", "Video Editing Lead", 10),
        member("PUL081BEI044", "Media Coordinator", 20),
        member("Tejaswi-Acharya", "Media Coordinator", 30),
        member("Pratik-Singh-Thapa", "Photography Lead", 40),
      ]),
      committee("external-relations", "External Relation Committee", 50, [
        member("PUL081BCT030", "Coordinator", 10),
        member("Tangsep-Chongbang", "Executive Member", 20),
        member("PUL082BCT064", "Executive Member", 30),
        member("Utsab-Raj-Bhattarai", "Executive Member", 40),
        member("Janak-Bhatta", "Video editing Executive Member", 50),
      ]),
      committee("research-development", "R&D Committee", 60, [
        member("Snigdh-Karki", "Coordinator", 10),
        member("PUL080BCT065", "Executive Member", 20),
        member("Shreyam-Regmi", "Executive Member", 30),
        member("Sunit-Shrestha", "Executive Member", 40),
      ]),
      committee("volunteer-members", "Volunteer Members", 70, [
        member("PUL082BEI011", "Volunteer", 10),
        member("PUL082BEI023", "Volunteer", 20),
        member("Binay-Kumar-Mandal", "Volunteer", 30),
        member("Vansh-Adhikari", "Volunteer", 40),
      ]),
      committee("senior-executives", "Senior Executives", 80, [
        member("Praharsha-Adhikari", "Senior Executive", 10),
        member("Prashansa-Shrestha", "Senior Executive", 20),
        member("Aeva-Acharya", "Senior Executive", 30),
        member("PUL079BCT093", "Senior Executive", 40),
      ]),
    ],
  },
  {
    year: "2025",
    sort: 2025,
    committees: [
      committee("committee", "Officers", 10, [
        member("Aarbid-Bhattarai", "Chair", 10),
        member("Praharsha-Adhikari", "Vice Chair", 20),
        member("Pawan-Kharel", "Secretary", 30),
        member("PUL080BCT049", "Vice Secretary", 40),
        member("PUL079BCT093", "Web Master", 50),
        member("Asim-Baral", "Treasurer", 60),]),
      committee("executive-members", "Executive Members", 20, [
        member("PUL079BCT075", "Executive Member", 70),
        member("PUL081BEI044", "Executive Member", 80),
        member("Aditya-Shah", "Executive Member", 90),
        member("Prabesh-Bastola", "Executive Member", 100),
        member("Janak-Bhatta", "Executive Member", 110),
        member("PUL080BCT092", "Executive Member", 120),
        member("Ishan-Gautam", "Executive Member", 130),
        member("Pratyush-Adhikary", "Executive Member", 140),
        member("PUL080BCT065", "Executive Member", 150),
        member("PUL080BCT003", "Executive Member", 160),
        member("Susmita-Paudel", "Executive Member", 170),
        member("PUL080BCT062", "Executive Member", 180),
        member("Kushal-Regmi", "Executive Member", 190),
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