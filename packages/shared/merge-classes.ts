import {
  Falsy,
  CssMergeFn,
  simpleJoinClasses,
  isTemplateStringArr,
  templateToOneLine,
} from "./utils";

export type MergeClassesArg = Falsy | string;
export type MergeClasses = {
  (classes: TemplateStringsArray, ...args: MergeClassesArg[]): string;
  (...classes: MergeClassesArg[]): string;
};
export const createMergeClasses =
  (cssMergeFunction: CssMergeFn = simpleJoinClasses): MergeClasses =>
  (first, ...others) =>
    isTemplateStringArr(first)
      ? cssMergeFunction(
          first.flatMap((style, i) => [
            templateToOneLine(style),
            others[i] ?? "",
          ])
        )
      : cssMergeFunction([first, ...others]);
