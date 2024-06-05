import { JSX } from "solid-js/jsx-runtime";
import {
  Falsy,
  CssMergeFn,
  simpleJoinClasses,
  createMergeClasses,
  MergeClassesArg,
  isTemplateStringArr,
} from "../../shared";
import { Component, WithStyles, createStyled } from "./styled";

type StyleFn = {
  <K extends keyof JSX.IntrinsicElements>(component: K): WithStyles<
    JSX.IntrinsicElements[K]
  >;
  <P extends { class?: string }>(
    component: (p: P) => JSX.Element
  ): WithStyles<P>;
} & {
  (classes: TemplateStringsArray, ...args: (Falsy | string)[]): string;
  // at least 2 args
  (
    ...classes: [MergeClassesArg, MergeClassesArg, ...MergeClassesArg[]]
  ): string;
};
export const createStyleFn = (
  cssMergeFunction: CssMergeFn = simpleJoinClasses
): StyleFn => {
  const styled = createStyled(cssMergeFunction);
  const mergeClasses = createMergeClasses(cssMergeFunction);

  const combined = (
    ...args:
      | [Component]
      | MergeClassesArg[]
      | [TemplateStringsArray, ...MergeClassesArg[]]
  ) => {
    const first = args[0];
    if (args.length === 1 && !isTemplateStringArr(args[0])) {
      return styled(args[0] as any);
    }
    // TODO: optimize for spread / unspread ?
    return mergeClasses(...(args as any[]));
  };
  return combined as StyleFn;
};

// const s = createStyleFn();
// s("div")`hi there`;
// s("a")("hi", "there");
// s("hi", "there");
// s(() => "hi")`hi there`;
// s("hi", null, "there");
// s("hi", "there");
