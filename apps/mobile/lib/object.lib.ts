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
