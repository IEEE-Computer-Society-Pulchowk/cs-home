import { describe, it, expect } from "vitest";
import { TEAM_YEARS } from "@/data/team";
import { getPersonById } from "@/data/people";

describe("TEAM_YEARS integrity", () => {
  const allMembers = TEAM_YEARS.flatMap((year) =>
    year.committees.flatMap((committee) =>
      committee.members.map((member) => ({
        personId: member.personId,
        role: member.role,
        committeeId: committee.id,
        year: year.year,
      }))
    )
  );

  it("all members reference a valid person", () => {
    const invalid = allMembers.filter(({ personId }) => !getPersonById(personId));
    expect(invalid).toEqual([]);
  });

  it("no duplicate members within the same committee and year", () => {
    const dupes = allMembers.filter(({ personId, committeeId, year }, i) =>
      allMembers.some(
        (m, j) =>
          j !== i &&
          m.personId === personId &&
          m.committeeId === committeeId &&
          m.year === year
      )
    );
    expect(dupes).toEqual([]);
  });

  it("no duplicate committee ids within the same year", () => {
    TEAM_YEARS.forEach(({ year, committees }) => {
      const ids = committees.map((c) => c.id);
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      expect(dupes, `year ${year}`).toEqual([]);
    });
  });

  it("committee sort values are unique within the same year", () => {
    TEAM_YEARS.forEach(({ year, committees }) => {
      const sorts = committees.map((c) => c.sort);
      const dupes = sorts.filter((s, i) => sorts.indexOf(s) !== i);
      expect(dupes, `year ${year}`).toEqual([]);
    });
  });

  it("member sort values are unique within the same committee", () => {
    TEAM_YEARS.forEach(({ year, committees }) =>
      committees.forEach(({ id, members }) => {
        const sorts = members.map((m) => m.sort);
        const dupes = sorts.filter((s, i) => sorts.indexOf(s) !== i);
        expect(dupes, `${year}/${id}`).toEqual([]);
      })
    );
  });

  it("year sort matches year string", () => {
    TEAM_YEARS.forEach(({ year, sort }) => {
      expect(sort, `year "${year}"`).toBe(Number(year));
    });
  });
});