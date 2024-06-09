import { CSSProperties } from "react";

/**
 * Easily propagate JS variables to css
 * @example
  const NavContainer = withStyle(
    { '--nav-size': `${NAV_LENGTH}px` },
    tw.div`
      flex justify-around items-center 
      text-center w-[--nav-size]
      md:h-[--nav-size] md:w-full md:flex-col
    `,
  )
 */
export const withStyle =
  <
    // extra comment to fix lint
    ExtraProps = {},
  >(
    styleObj: Record<
      string,
      string | number | ((p: ExtraProps) => string | number)
    >
  ) =>
  <BaseProps extends { style?: CSSProperties }>(
    Component: (p: BaseProps) => JSX.Element
  ) => {
    const WithStyle = (p: BaseProps & ExtraProps): JSX.Element => {
      const { style, ...others } = p;

      const finalStyle = () => {
        const mapped = {} as any;
        Object.keys(styleObj).forEach((k) => {
          const v = styleObj[k];
          mapped[k] = typeof v === "function" ? v(p) : v;
        });
        return Object.assign(mapped, style);
      };

      return <Component style={finalStyle()} {...(others as any)} />;
    };
    return WithStyle;
  };
