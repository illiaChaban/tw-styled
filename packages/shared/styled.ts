import { Falsy, isTemplateStringArr, templateToOneLine } from "./utils";

export type StyledArg<P> = string | Falsy | ((props: P) => string | Falsy);
export type Styles = [
  TemplateStringsArray | StyledArg<any>,
  ...StyledArg<any>[]
];
type PreprocessedArgs = StyledArg<any>[];
// type ProcessedArgs = (string | Falsy)[];

export const preprocessArgs =
  (classNameKey: string) =>
  (args: Styles): PreprocessedArgs => {
    const [first, ...others] = args;
    return isTemplateStringArr(first)
      ? first.flatMap((str, i) => [
          templateToOneLine(str),
          i === first.length - 1
            ? (props: any) => props[classNameKey]
            : preprocessArg(others[i]),
        ])
      : (args as StyledArg<any>[]);
  };

const preprocessArg = (
  arg: StyledArg<any>
): string | ((props: any) => string | Falsy) =>
  !!arg === false
    ? ""
    : typeof arg === "string"
    ? templateToOneLine(arg)
    : typeof arg === "function"
    ? (props: any) => {
        const v = arg(props);
        return v && templateToOneLine(v);
      }
    : (() => {
        throw `Unsupported type: ${typeof arg}`;
      })();
