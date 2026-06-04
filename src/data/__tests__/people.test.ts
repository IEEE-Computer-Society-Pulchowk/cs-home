import { expect, test } from "vitest";
import { PEOPLE } from "@/data/people";

const entries = Object.entries(PEOPLE);

test("no duplicate ids", () => {
  const ids = entries.map(([id]) => id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  expect(dupes).toEqual([]);
});

test("no duplicate membershipIds", () => {
  const mids = entries
    .map(([, p]) => p.membership)
    .filter((m): m is number => m !== undefined);
  const dupes = mids.filter((m, i) => mids.indexOf(m) !== i);
  expect(dupes).toEqual([]);
});

test("no duplicate slugs", () => {
  const slugs = entries.map(([, p]) => p.slug);
  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  expect(dupes).toEqual([]);
});