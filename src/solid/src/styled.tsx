import { splitProps, ComponentProps, JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import {
  CssMergeFn,
  simpleJoinClasses,
  isTemplateStringArr,
  templateToOneLine,
  pick,
  Falsy,
} from "../../shared";

export type Styled = {
  <K extends keyof JSX.IntrinsicElements>(component: K): WithStyles<
    JSX.IntrinsicElements[K]
  >;
  <P extends { class?: string }>(
    component: (p: P) => JSX.Element
  ): WithStyles<P>;
};

export const createStyled = (
  cssMergeFunction: CssMergeFn = simpleJoinClasses
): Styled => {
  return (Component: keyof JSX.IntrinsicElements | ((p: {}) => JSX.Element)) =>
    (...args: Styles) => {
      const preprocessedValues = preprocessArgs(args);

      const Styled: StyledComponent<any> = (props: any) => {
        const [, p2] = splitProps(props, ["class", "as"]);

        const final = () =>
          cssMergeFunction(
            preprocessedValues.map((v) =>
              typeof v === "function" ? v(props) : v
            )
          );

        const component = () => props.as ?? Component;

        const otherProps = () => {
          const Component = component();
          if (typeof Component === "function") return p2;
          // avoid propagating $<key> to html elements
          const keys = Object.keys(p2).filter((k) => !k.startsWith("$"));
          // should i use split props here? Is there a performance optimization opportunity?
          return pick(p2, keys);
        };

        return (
          <Dynamic component={component()} class={final()} {...otherProps()} />
        );
      };
      return Styled;
    };
};

type Styles = [TemplateStringsArray | StyledArg<any>, ...StyledArg<any>[]];
type PreprocessedArgs = StyledArg<any>[];
type ProcessedArgs = (string | Falsy)[];

const preprocessArgs = (args: Styles): PreprocessedArgs => {
  const [first, ...others] = args;
  return isTemplateStringArr(first)
    ? first.flatMap((str, i) => [
        templateToOneLine(str),
        i === first.length - 1
          ? (props: any) => props.class
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

export type StyledArg<P> = string | Falsy | ((props: P) => string | Falsy);

export type WithStyles<BaseProps extends {}> = <ExtraProps extends {} = {}>(
  classes: TemplateStringsArray | StyledArg<ExtraProps>,
  ...args: StyledArg<ExtraProps>[]
) => StyledComponent<BaseProps, ExtraProps>;

export type Component = keyof JSX.IntrinsicElements | ((p: {}) => JSX.Element);

export type StyledComponent<
  BaseProps extends {},
  ExtraProps extends {} = {}
> = {
  <As extends Component>(
    props: { as: As } & ComponentProps<As> & ExtraProps
  ): JSX.Element;
  (props: BaseProps & ExtraProps): JSX.Element;
};
