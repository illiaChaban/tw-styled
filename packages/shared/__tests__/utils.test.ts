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
});
