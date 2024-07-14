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

export const line = (
  templateStrOrStr: TemplateStringsArray | string | number | Falsy,
  ...others: (string | number | Falsy)[]
) => {
  if (isTemplateStringArr(templateStrOrStr)) {
    const updated = [...templateStrOrStr];
    updated[0] = updated[0].trimStart();
    updated[updated.length - 1] = updated[updated.length - 1].trimEnd();
    return updated
      .flatMap((str, i) => [
        str
          .split("\n")
          // only trim & replace with a space between new lines
          .map((s, i, all) => {
            if (all.length === 1) return s;
            if (i === 0) return s.trimEnd();
            if (i === all.length - 1) return s.trimStart();
            return s.trim();
          })
          .filter((s) => s?.length)
          .join(" "),
        others[i],
      ])

      .filter(Boolean)
      .join("");
  }
  return [templateStrOrStr, ...others].filter(Boolean).join(" ");
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

export type KeyToOmit<
  R extends Record<string, unknown> = Record<string, unknown>
> = keyof R | ((k: string) => boolean);
export const omitKeys = <R extends Record<string, unknown>>(
  obj: R,
  keys: KeyToOmit<R>[]
): R => {
  const newObj = {} as R;
  const predicate = (value: string) =>
    keys.every((k) => (typeof k === "function" ? !k(value) : value !== k));
  Object.keys(obj)
    .filter(predicate)
    .forEach((key: keyof R) => {
      newObj[key] = obj[key];
    });
  return newObj;
};

export const isTemplateStringArr = (v: any): v is TemplateStringsArray =>
  Array.isArray(v) && !!(v as any).raw;
