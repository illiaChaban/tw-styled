import { JSX } from "solid-js/jsx-runtime";
import {
  Falsy,
  CssMergeFn,
  simpleJoinClasses,
  MergeClasses,
  createMergeClasses,
} from "../../shared";
import { WithStyles, createStyled } from "./styled";

export type StyleFn = {
  <P extends { class?: string }>(
    component: (p: P) => JSX.Element
  ): WithStyles<P>;
} & {
  [K in keyof JSX.IntrinsicElements]: WithStyles<JSX.IntrinsicElements[K]>;
} & MergeClasses;
export const createStyleFn = (
  cssMergeFunction: CssMergeFn = simpleJoinClasses
): StyleFn => {
  const styled = createStyled(cssMergeFunction);
  const mergeClasses = createMergeClasses(cssMergeFunction);

  const combined = (
    ...args:
      | [(p: {}) => JSX.Element]
      | (string | Falsy)[]
      | [TemplateStringsArray, ...any[]]
  ) => {
    const first = args[0];
    if (typeof first === "function") return styled(first);
    return mergeClasses(...args);
  };

  return new Proxy(combined, {
    get(_, name: keyof JSX.IntrinsicElements) {
      return styled(name);
    },
  }) as StyleFn;
};

// const s = createStyleFn()
// s.div`hello`
// s('hi', 'there')
// s(() => 'hi')`hi there`
// s.a('hi', null, 'there')
