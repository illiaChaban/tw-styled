import { Falsy, isTemplateStringArr, templateToOneLine } from "./utils";

type StyledArg<P, Arg> = Arg | Falsy | ((props: P) => Arg | Falsy);
export type Styles<Props = any> =
  // only strings as arguments since number is not a valid css class
  | StyledArg<Props, string>[]
  | [TemplateStringsArray, ...StyledArg<Props, string | number>[]];
type PreprocessedArgs = StyledArg<any, string>[];

export const preprocessArgs = (args: Styles): PreprocessedArgs => {
  return isTemplateStringArr(args[0])
    ? args[0].flatMap((str, i) => [
        templateToOneLine(str),
        preprocessArg(args[i + 1] as StyledArg<any, string | number>),
      ])
    : (args as StyledArg<any, string>[]);
};

const preprocessArg = (
  arg: StyledArg<any, string | number>
): string | ((props: any) => string) =>
  !!arg === false
    ? ""
    : typeof arg === "string"
    ? templateToOneLine(arg)
    : typeof arg === "number"
    ? arg.toString()
    : typeof arg === "function"
    ? (props: any) => {
        const v = arg(props);
        if (typeof v === "function") throw `Can't have another function`;
        return preprocessArg(v) as string;
      }
    : (() => {
        throw `Unsupported type: ${typeof arg}`;
      })();
