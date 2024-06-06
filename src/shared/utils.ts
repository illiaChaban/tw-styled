export type Falsy = false | null | undefined | 0 | "";

export type CssMergeFn = (maybeClasses: (string | Falsy)[]) => string;

export const simpleJoinClasses: CssMergeFn = (classes) =>
  classes.filter(Boolean).join(" ");

// const templateToClasses = (templateStr: string): string[] => {
//   return templateStr.split(" ").filter((s) => s.length && s !== "\n");
// };
export const templateToOneLine = (templateStr: string): string => {
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

export const pick = <R extends Record<string, unknown>, P extends keyof R>(
  obj: R,
  keys: P[]
): Pick<R, P> => {
  const picked = {} as any;
  keys.forEach((k) => (picked[k] = obj[k]));
  return picked;
};

// export const pickBy = <R extends Record<string, unknown>>(obj: R, fn: <K extends keyof R>(value:R[K], key: K) => boolean): R => {
//   const newObj = {} as R
//   Object.keys(obj).forEach((key: keyof R )=> {
//     const value = obj[key] as R[keyof R]
//     if (fn(value, key)) newObj[key] = value
//   })
//   return newObj
// }
// export const omitby = <R extends Record<string, unknown>>(obj: R, fn: <K extends keyof R>(value:R[K], key: K) => boolean): R => {
//   return pickBy(obj, (...args) => !fn(...args))
// }

// export const omitKeys = <R extends Record<string, unknown>>(
//   obj: R,
//   fn: (key: keyof R) => boolean
// ): R => {
//   const newObj = {} as R;
//   Object.keys(obj)
//     .filter((v) => !fn(v))
//     .forEach((key: keyof R) => {
//       newObj[key] = obj[key];
//     });
//   return newObj;
// };

export const isTemplateStringArr = (v: any): v is TemplateStringsArray =>
  Array.isArray(v) && !!(v as any).raw;
