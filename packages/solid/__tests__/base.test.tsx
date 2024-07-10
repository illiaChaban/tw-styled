import { render } from "@solidjs/testing-library";
import { createStyleFn } from "../src";
import { describe, it, expect } from "vitest";
import { JSX } from "solid-js/jsx-runtime";

describe("tw", () => {
  const s = createStyleFn();

  describe("class joiner", () => {
    it("should cleanup class names", () => {
      expect(s`hi ${null}
            ${0} ${true && "there"}
        
          how are you
      `).toBe("hi there how are you");
    });
  });

  describe("styled", () => {
    it("should render a styled component with applied class", () => {
      const Styled = s.div`
        hello world
      `;
      const { container, unmount } = render(() => <Styled />);
      expect(container.innerHTML).toBe(`<div class="hello world"></div>`);
      unmount();
    });

    it("should render a styled component with applied class and children", () => {
      const Styled = s.div`
        hello world
      `;
      const { container, unmount } = render(() => <Styled>Hi there</Styled>);
      expect(container.innerHTML).toBe(
        `<div class="hello world">Hi there</div>`
      );
      unmount();
    });

    it("should handle falsy values", () => {
      const Styled = s.div`
        hello world ${null} ${false} ${0}
        here
      `;
      const { container, unmount } = render(() => <Styled>Hi there</Styled>);
      expect(container.innerHTML).toBe(
        `<div class="hello world here">Hi there</div>`
      );
      unmount();
    });

    it("should support props & shouldn't propagate styling props to html elements", () => {
      const Styled = s.div<{ $sayHello?: boolean }>`
        ${(p) => (p.$sayHello ? "hello" : "bye")} world
      `;

      const render1 = render(() => <Styled>Bye</Styled>);
      expect(render1.container.innerHTML).toBe(
        '<div class="bye world">Bye</div>'
      );

      const render2 = render(() => <Styled $sayHello>Hi</Styled>);
      expect(render2.container.innerHTML).toBe(
        '<div class="hello world">Hi</div>'
      );
    });

    it('should support "as" prop', () => {
      const Styled = s.div`
        hello world
      `;
      const r = render(() => <Styled as="button">Hi</Styled>);

      expect(r.container.innerHTML).toBe(
        `<button class="hello world">Hi</button>`
      );

      const Other = (
        p: Pick<JSX.HTMLElementTags["a"], "class" | "ref" | "children"> & {
          // required
          href: string;
        }
      ) => <a {...p} />;

      let ref: HTMLAnchorElement;
      const r2 = render(() => (
        <Styled as={Other} class="other" href="_href" ref={(el) => (ref = el)}>
          Hi
        </Styled>
      ));
      expect(r2.container.innerHTML).toBe(
        `<a class="hello world other" href="_href">Hi</a>`
      );
      expect(ref!.tagName).toBe("A");
    });

    it("should be composable", () => {
      const Styled1 = s.div`
        hello world
      `;
      const Styled2 = s(Styled1)`hi there`;

      const r1 = render(() => <Styled2>Hi</Styled2>);
      expect(r1.container.innerHTML).toBe(
        `<div class="hello world hi there">Hi</div>`
      );

      const r2 = render(() => <Styled2 as="button">Hey</Styled2>);
      expect(r2.container.innerHTML).toBe(
        `<button class="hi there">Hey</button>`
      );

      const Styled3 = s(Styled1)`
        another 
        one
      `;
      const r3 = render(() => <Styled2 as={Styled3}>Third</Styled2>);
      expect(r3.container.innerHTML).toBe(
        `<div class="hello world another one hi there">Third</div>`
      );
    });

    it("should support multiple styles to compose classes", () => {
      const Button = s.button<{ $size?: "sm" }>`
        ${(p) => p.$size === "sm" && "text-sm"}
        font-bold
      `;
      expect(innerHtml(() => <Button>Hello</Button>)).toBe(
        `<button class="font-bold">Hello</button>`
      );
      expect(innerHtml(() => <Button class="test">Hello</Button>)).toBe(
        `<button class="font-bold test">Hello</button>`
      );
      expect(innerHtml(() => <Button $size="sm">Hello</Button>)).toBe(
        `<button class="text-sm font-bold">Hello</button>`
      );
      expect(
        innerHtml(() => (
          <Button $size="sm" class="test">
            Hello
          </Button>
        ))
      ).toBe(`<button class="text-sm font-bold test">Hello</button>`);

      const Button2 = s.button<{ $size?: "sm" }>(
        (p) => p.$size === "sm" && "text-sm",
        "font-bold"
      );
      expect(innerHtml(() => <Button2>Hello</Button2>)).toBe(
        `<button class="font-bold">Hello</button>`
      );
      expect(innerHtml(() => <Button2 class="test">Hello</Button2>)).toBe(
        `<button class="font-bold test">Hello</button>`
      );
      expect(innerHtml(() => <Button2 $size="sm">Hello</Button2>)).toBe(
        `<button class="text-sm font-bold">Hello</button>`
      );
      expect(
        innerHtml(() => (
          <Button2 $size="sm" class="test">
            Hello
          </Button2>
        ))
      ).toBe(`<button class="text-sm font-bold test">Hello</button>`);
    });
  });
});

const innerHtml = (...args: Parameters<typeof render>): string =>
  render(...args).container.innerHTML;
