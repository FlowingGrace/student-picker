interface ClassDictionary {
  [key: string]: boolean | string | number | undefined | null;
}

export function classNames(...args: (string | number | ClassDictionary | (string | number | ClassDictionary | null | undefined)[])[]): string {
  const classes: string[] = [];

  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === "string" || typeof arg === "number") {
      classes.push(String(arg));
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        // 过滤掉null和undefined，确保传递给递归调用的参数都是有效的
        const validArgs = arg.filter(item => item !== null && item !== undefined);
        if (validArgs.length > 0) {
          // 使用更精确的类型，避免使用any
          const inner = classNames(...validArgs as [string | number | ClassDictionary | (string | number | ClassDictionary)[]]);
          if (inner) classes.push(inner);
        }
      }
    } else if (typeof arg === "object") {
      for (const [key, value] of Object.entries(arg)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(" ");
}
