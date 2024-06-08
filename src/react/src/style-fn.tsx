import { JSX } from "react";
import {
  Falsy,
  CssMergeFn,
  simpleJoinClasses,
  MergeClasses,
  createMergeClasses,
} from "../../shared";
import { WithStyles, createStyled } from "./styled";

export type StyleFn = {
  <P extends { className?: string }>(
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
