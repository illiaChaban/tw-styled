import { splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { Dynamic } from "solid-js/web";
// import { twMerge } from 'tailwind-merge'

/**
 * 
 * @ settings.json for autocomplete & lint for TW extension
 * 
 *     "tailwindCSS.classAttributes": [
        "class",
        "className",
        "ngClass",
    ],
    "tailwindCSS.experimental.classRegex": [
        "tw`([^`]*)", // tw`...`
        // "tw\\.[^`]+`([^`]*)`", // tw.xxx<xxx>`...`
        // "tw\\(.*?\\).*?`([^`]*)" // tw(Component)<xxx>`...`
        // "tw\\(.*?\\).*?`([^`]*)" // tw(Component)<xxx>`...`
        "tw\\(.*?\\)(?:<.*?>)?`([^`]*)`" // tw(Component)<xxx>`...`
    ]
 */

type CssMergeFn = (maybeClasses: (string | Falsy)[]) => string;

export const createTw = (cssMergeFunction: CssMergeFn = simpleJoinClasses) =>
  ((
    classesOrComponent:
      | keyof JSX.IntrinsicElements
      | ((p: {}) => JSX.Element)
      | TemplateStringsArray,
    ...args: any[]
  ) => {
    if (isTemplateStringArr(classesOrComponent)) {
      return cssMergeFunction(
        classesOrComponent.flatMap((style, i) => [
          templateToOneLine(style),
          args[i] ?? "",
        ])
      );
    }

    const Component = classesOrComponent;

    return (classes: TemplateStringsArray, ...args: TagArg<any>[]) => {
      const preprocessedValues = classes.flatMap((str, i) => [
        templateToOneLine(str),
        i === classes.length - 1
          ? (props: any) => props.class
          : preprocessArg(args[i]),
      ]);

      return (props: any) => {
        const [, p2] = splitProps(props, ["class", "as"]);

        const final = () =>
          cssMergeFunction(
            preprocessedValues.map((v) =>
              typeof v === "function" ? v(props) : v
            )
          );

        return (
          <Dynamic component={props.as ?? Component} class={final()} {...p2} />
        );
      };
    };
  }) as Tw;

const isTemplateStringArr = (v: any): v is TemplateStringsArray =>
  !!v.raw && Array.isArray(v);

const preprocessArg = (
  arg: TagArg<any>
): string | ((props: any) => string | Falsy) =>
  typeof arg === "string"
    ? templateToOneLine(arg)
    : typeof arg === "function"
    ? (props: any) => {
        const v = arg(props);
        return v && templateToOneLine(v);
      }
    : (() => {
        throw `Unsupported type: ${typeof arg}`;
      })();

// const templateToClasses = (templateStr: string): string[] => {
//   return templateStr.split(" ").filter((s) => s.length && s !== "\n");
// };
const templateToOneLine = (templateStr: string): string => {
  return (
    templateStr
      .split("\n")
      // FYI this ignores spaced in between classes and trims only outside spaces
      // trimming inside spaces may not be worth it performace wise VS how common it is
      .map((s) => s.trim())
      // .map((key: string) => {
      //   return key.trim().replace(/^\s+|\s+$/gm, "");
      // })
      .filter((s) => s?.length)
      .join(" ")
  );
};

type Falsy = false | null | undefined | 0 | "";

type TagArg<P> = string | ((props: P) => string | Falsy);

type InternalProps = {
  as?: keyof JSX.IntrinsicElements | ((p: {}) => JSX.Element);
};

type TagFn<BaseProps extends {}> = <ExtraProps extends {} = {}>(
  classes: TemplateStringsArray,
  ...args: TagArg<ExtraProps>[]
) => (
  // TODO: support conditional props based on "as" internal prop.
  // i.e. "as" component function accepts certtain props that become "BaseProps"
  props: BaseProps & ExtraProps & InternalProps
) => JSX.Element;

type Tw = {
  <K extends keyof JSX.IntrinsicElements>(component: K): TagFn<
    JSX.IntrinsicElements[K]
  >;
  <P extends { class?: string }>(component: (p: P) => JSX.Element): TagFn<P>;
  // return css class, use for autocomplete purposes
  (
    styles: TemplateStringsArray,
    ...args: (string | number | false | null | undefined)[]
  ): string;
};

const simpleJoinClasses: CssMergeFn = (classes) =>
  classes.filter(Boolean).join(" ");
