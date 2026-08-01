import { describe, expect, test } from "bun:test";
import { plainDescription } from "./description";

describe("plainDescription", () => {
  test("strips markdown and collapses whitespace", () => {
    expect(plainDescription("**Linux 101**\n\nFrom `never touched a terminal` to [admin](https://x).\n\n- item one\n- item two\n\nNew para.", 1000)).toBe(
      "Linux 101 From never touched a terminal to admin. item one item two New para.",
    );
  });

  test("truncates to max chars with ellipsis", () => {
    const out = plainDescription("a".repeat(300), 160);
    expect(out.length).toBe(160);
    expect(out.endsWith("…")).toBe(true);
  });

  test("leaves short text intact", () => {
    expect(plainDescription("Short text.")).toBe("Short text.");
  });
});
