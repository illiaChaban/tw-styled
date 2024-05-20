import postcss from "postcss";
import tailwindcss from "tailwindcss";
import {
  postcssPlugin,
  CompressedConfig,
  writeConfig,
  createCssMerge,
} from "@illlia/css-merge";
import { isEmpty } from "@illlia/ts-utils";
import { StyleFn, createCssStyled } from "../src";
import { render } from "@solidjs/testing-library";

describe("tw with css-merge", () => {
  let cssMergeConfig: CompressedConfig;

  it("should generate config based on tailwind css with tailwind plugin", async () => {
    const inputCss = `
        @tailwind utilities;
      `;

    const processed = await postcss([
      tailwindcss({
        content: [__dirname + "/*"],
      }),
      postcssPlugin({
        onParsed: (data) => (cssMergeConfig = data),
      }),
    ]).process(inputCss, { from: undefined });

    // console.log(processed.css);

    expect(isEmpty(cssMergeConfig)).toBe(false);
  });

  let tw: StyleFn;

  it("should create tw with merging logic", () => {
    const cssMerge = createCssMerge(cssMergeConfig);
    tw = createCssStyled((classes) => cssMerge(...classes));
    expect(typeof tw).toBe("function");
  });

  it("should merge passed in classes", () => {
    expect(tw`px-2 ${"p-4"}`).toBe("p-4");
    expect(tw`p-4 ${"px-2"}`).toBe("p-4 px-2");
    expect(tw`px-2 p-4`).toBe("px-2 p-4");
  });

  it("should merge classes with styled", () => {
    const Styled = tw("div")`
      px-2 py-4
    `;
    const r = render(() => <Styled class="pb-1">Hi</Styled>);
    expect(r.container.innerHTML).toBe(`<div class="px-2 py-4 pb-1">Hi</div>`);

    const r2 = render(() => <Styled class="p-3">Hey</Styled>);
    expect(r2.container.innerHTML).toBe(`<div class="p-3">Hey</div>`);
  });

  it("should compose classes with styled", () => {
    const S1 = tw("span")`
      p-2 px-3
      mx-3
    `;
    const S2 = tw(S1)`
      m-2
      px-4 
    `;
    const r = render(() => <S2>Yo</S2>);
    expect(r.container.innerHTML).toBe(`<span class="p-2 m-2 px-4">Yo</span>`);

    const r2 = render(() => <S2 />);
    expect(r2.container.innerHTML).toBe(`<span class="p-2 m-2 px-4"></span>`);
  });
});
