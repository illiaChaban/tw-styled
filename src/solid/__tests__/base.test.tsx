import { render } from "@solidjs/testing-library";
import { createCssStyled } from "../src";
import { describe, it, expect } from "vitest";

describe("tw", () => {
  const s = createCssStyled();

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
      const Styled = s("div")`
        hello world
      `;
      const { container, unmount } = render(() => <Styled />);
      expect(container.innerHTML).toBe(`<div class="hello world"></div>`);
      unmount();
    });

    it("should render a styled component with applied class and children", () => {
      const Styled = s("div")`
        hello world
      `;
      const { container, unmount } = render(() => <Styled>Hi there</Styled>);
      expect(container.innerHTML).toBe(
        `<div class="hello world">Hi there</div>`
      );
      unmount();
    });

    it("should handle falsy values", () => {
      const Styled = s("div")`
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
      const Styled = s("div")<{ $sayHello?: boolean }>`
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
      const Styled = s("div")`
        hello world
      `;
      const r = render(() => <Styled as="button">Hi</Styled>);

      expect(r.container.innerHTML).toBe(
        `<button class="hello world">Hi</button>`
      );
    });

    it("should be composable", () => {
      const Styled1 = s("div")`
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
  });
});
