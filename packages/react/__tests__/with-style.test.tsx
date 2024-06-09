import { describe, expect, it } from "vitest";
import { createStyleFn, withStyle } from "../src";
import { render } from "@testing-library/react";

describe(withStyle.name, () => {
  const s = createStyleFn();

  it("should propagate style", () => {
    const X = withStyle<{ $dynamic?: number }>({
      "--test": "40px",
      "--test-dynamic": (p) => `${p.$dynamic ?? 10}ms`,
    })(s.div`hello world`);

    const r = render(<X $dynamic={20}>Hi</X>);
    expect(r.container.innerHTML).toBe(
      `<div style="--test: 40px; --test-dynamic: 20ms;" class="hello world">Hi</div>`
    );

    const r2 = render(<X $dynamic={25}>Hi</X>);
    expect(r2.container.innerHTML).toBe(
      `<div style="--test: 40px; --test-dynamic: 25ms;" class="hello world">Hi</div>`
    );

    const r3 = render(<X>Hi</X>);
    expect(r3.container.innerHTML).toBe(
      `<div style="--test: 40px; --test-dynamic: 10ms;" class="hello world">Hi</div>`
    );
  });
});
