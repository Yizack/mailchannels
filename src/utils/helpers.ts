export const stripPemHeaders = (pem: string) => pem.replace(/-----[^-]+-----|\s|#.*$/gm, "");

export const clean = <T>(value: T): T => {
  if (Array.isArray(value)) {
    const result: unknown[] = [];
    for (let i = 0; i < value.length; i++) {
      const cleaned = clean(value[i]);
      if (cleaned !== undefined) {
        result.push(cleaned);
      }
    }
    return result as T;
  }

  if (value && typeof value === "object" && value.constructor === Object) {
    const result: Record<string, unknown> = {};
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!;
      const cleaned = clean(obj[key]);
      if (cleaned !== undefined) {
        result[key] = cleaned;
      }
    }
    return result as T;
  }

  return value;
};
