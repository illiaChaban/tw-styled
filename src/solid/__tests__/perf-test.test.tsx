import { describe, expect, it } from "vitest";
import { createStyleFn as createStyleFnNormal } from "../src/css-styled-3";
import { createStyleFn as createStyleFnProxy } from "../src/css-styled-2";
// warm up
let count = 0;
for (let i = 0; i < 10000; i++) {
  count += Math.floor(Math.random() * 100);
}

const cycles = 100000;

const s1 = createStyleFnNormal();
const s = createStyleFnProxy();

console.time("Normal test 1");
for (let i = 0; i < cycles; i++) {
  // s1("div")`hello`;
  // s1("a")`hello`;

  s1`hello ${"world"}`;
  s1("hello", "world");
}
console.timeEnd("Normal test 1");

console.time("Proxy test 1");
for (let i = 0; i < cycles; i++) {
  // s2.div`hello`;
  // s2.a`hello`;

  s`hello ${"world"}`;
  s("hello", "world");
  s.a`hello`;
  s.div`flex block`;
}
console.timeEnd("Proxy test 1");

describe("test", () => {
  it("should run", () => {
    expect(true).toBe(true);
  });
});
