import { describe, it, expect } from "vitest";
import { TEAM_YEARS } from "@/data/team";
import { PEOPLE } from "@/data/people";

describe("TEAM_YEARS integrity", () => {
  const allMembers = TEAM_YEARS.flatMap((year) =>
    year.committees.flatMap((committee) =>
      committee.members.map((member) => ({
        personId: member.personId,
        role: member.role,
        committee: committee.id,
        year: year.year,
      }))
    )
  );

  it("all members reference a valid person", () => {
    const invalid = allMembers.filter(({ personId }) => !PEOPLE[personId]);
    expect(invalid).toEqual([]);
  });

  it("no duplicate members within the same committee and year", () => {
    const dupes = allMembers.filter(({ personId, committee, year }, i) =>
      allMembers.some(
        (m, j) =>
          j !== i &&
          m.personId === personId &&
          m.committee === committee &&
          m.year === year
      )
    );
    expect(dupes).toEqual([]);
  });
});