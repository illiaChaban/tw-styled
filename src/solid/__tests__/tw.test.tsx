import { render, fireEvent } from "@solidjs/testing-library";
// import { createTw } from "./tw";
import { createTw } from "../src";

describe("tw", () => {
  const tw = createTw();

  describe("class joiner", () => {
    it("should cleanup class names", () => {
      expect(tw`hi ${null}
            ${0} ${true && "there"}
        
          how are you
      `).toBe("hi there how are you");
    });
  });

  describe("styled", () => {
    it("should render a styled component with applied class", () => {
      const Styled = tw("div")`
        hello world
      `;
      const { container, unmount } = render(() => <Styled />);
      expect(container.innerHTML).toBe(`<div class="hello world"></div>`);
      unmount();
    });

    it("should render a styled component with applied class and children", () => {
      const Styled = tw("div")`
        hello world
      `;
      const { container, unmount } = render(() => <Styled>Hi there</Styled>);
      expect(container.innerHTML).toBe(
        `<div class="hello world">Hi there</div>`
      );
      unmount();
    });

    it("should handle falsy values", () => {
      const Styled = tw("div")`
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
      const Styled = tw("div")<{ $sayHello?: boolean }>`
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
      const Styled = tw("div")`
        hello world
      `;
      const r = render(() => <Styled as="button">Hi</Styled>);

      expect(r.container.innerHTML).toBe(
        `<button class="hello world">Hi</button>`
      );
    });

    it("should be composable", () => {
      const Styled1 = tw("div")`
        hello world
      `;
      const Styled2 = tw(Styled1)`hi there`;

      const r1 = render(() => <Styled2>Hi</Styled2>);
      expect(r1.container.innerHTML).toBe(
        `<div class="hello world hi there">Hi</div>`
      );

      const r2 = render(() => <Styled2 as="button">Hey</Styled2>);
      expect(r2.container.innerHTML).toBe(
        `<button class="hello world hi there">Hey</button>`
      );
    });
  });
});
