import { ComponentProps, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import {
  CssMergeFn,
  StyledArg,
  Styles,
  pick,
  preprocessArgs,
  simpleJoinClasses,
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
      const preprocessedValues = preprocessArgs("class")(args);

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
          if (typeof component() === "function") return p2;
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
