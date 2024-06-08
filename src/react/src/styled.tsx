import React, { ComponentProps, JSX } from "react";
import {
  CssMergeFn,
  StyledArg,
  Styles,
  omitKeys,
  preprocessArgs,
  simpleJoinClasses,
} from "../../shared";

export type Styled = {
  <K extends keyof JSX.IntrinsicElements>(component: K): WithStyles<
    JSX.IntrinsicElements[K]
  >;
  <P extends { className?: string }>(
    component: (p: P) => JSX.Element
  ): WithStyles<P>;
};

export const createStyled = (
  cssMergeFunction: CssMergeFn = simpleJoinClasses
): Styled => {
  return (_Component: keyof JSX.IntrinsicElements | ((p: {}) => JSX.Element)) =>
    (...args: Styles) => {
      const preprocessedValues = preprocessArgs("className")(args);

      // TODO: does it need forwardRef ?
      const Styled: StyledComponent<any> = (props: any) => {
        const { as, className, ...others } = props;

        const final = cssMergeFunction(
          preprocessedValues.map((v) =>
            typeof v === "function" ? v(props) : v
          )
        );

        const Component = as ?? _Component;

        const otherProps = () => {
          if (typeof Component === "function") return others;
          // avoid propagating $<key> to html elements
          return omitKeys(others, [(k) => k.startsWith("$")]);
        };

        return <Component {...otherProps()} className={final} />;
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
