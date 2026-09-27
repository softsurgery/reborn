export const setDeepValue = <T>(obj: any, path: string, value: T): any => {
  if (!path) return obj;

  const keys = path.split(".");
  let current = obj;

  keys.forEach((key, i) => {
    const isLast = i === keys.length - 1;
    const isArrayIndex = /^\d+$/.test(key);
    const index = isArrayIndex ? Number(key) : null;

    if (isLast) {
      if (isArrayIndex && Array.isArray(current)) {
        current[index!] = value;
      } else if (isArrayIndex && !Array.isArray(current)) {
        current[key] = []; // fallback: create array if not exist
        current[key][index!] = value;
      } else {
        current[key] = value;
      }
    } else {
      // Create next level if missing
      if (isArrayIndex) {
        if (!Array.isArray(current[key])) current[key] = [];
        if (!current[key][index!]) current[key][index!] = {};
        current = current[key][index!];
      } else {
        if (typeof current[key] !== "object" || current[key] === null) {
          current[key] = {};
        }
        current = current[key];
      }
    }
  });

  return obj;
};

export function setDeep<T extends object>(obj: T, path: string, value: any): T {
  const keys = path.split(".");

  const clone: any = Array.isArray(obj) ? [...obj] : { ...obj };
  let current: any = clone;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    const isIndex = !isNaN(Number(key));
    const isNextIndex = !isNaN(Number(nextKey));

    const next = isIndex ? current[Number(key)] : current[key];

    const newValue =
      next !== undefined
        ? Array.isArray(next)
          ? [...next]
          : { ...next }
        : isNextIndex
          ? []
          : {};

    if (isIndex) {
      current[Number(key)] = newValue;
      current = current[Number(key)];
    } else {
      current[key] = newValue;
      current = current[key];
    }
  }

  const lastKey = keys[keys.length - 1];
  const isLastIndex = !isNaN(Number(lastKey));

  const prevValue = isLastIndex ? current[Number(lastKey)] : current[lastKey];

  const finalValue = typeof value === "function" ? value(prevValue) : value;

  if (isLastIndex) {
    current[Number(lastKey)] = finalValue;
  } else {
    current[lastKey] = finalValue;
  }

  return clone as T;
}