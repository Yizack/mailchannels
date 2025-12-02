export const stripPemHeaders = (pem: string) => pem.replace(/-----[^-]+-----|\s|#.*$/gm, "");

/**
 * Recursively removes undefined values from objects and arrays.
 * @param data - The data to clean
 * @returns The cleaned data with `undefined` properties removed
 */
export const clean = <T>(data: T): T => {
  if (Array.isArray(data)) {
    const result: unknown[] = [];
    for (let i = 0; i < data.length; i++) {
      const cleaned = clean(data[i]);
      if (cleaned !== undefined) {
        result.push(cleaned);
      }
    }
    return result as T;
  }

  if (data && typeof data === "object" && data.constructor === Object) {
    const result: Record<string, unknown> = {};
    const obj = data as Record<string, unknown>;
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

  return data;
};
