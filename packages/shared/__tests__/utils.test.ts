import { describe, it, expect } from "vitest";
import { line } from "../utils";

describe(line.name, () => {
  it("should make one line", () => {
    expect(
      line`
        hello
        world
      `
    ).toBe("hello world");

    expect(line("hi", "there")).toBe("hi there");
  });

  it("should match complex case", () => {
    const lined = line`translate(calc(${5}px - 50%), calc(${3}px + ${"50%"} ))`;
    const noLine = `translate(calc(${5}px - 50%), calc(${3}px + ${"50%"} ))`;

    expect(lined).toBe(noLine);
  });
});
