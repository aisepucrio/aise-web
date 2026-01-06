export function formatCountFromArray(arr: unknown, fallback: string | number) {
  try {
    if (Array.isArray(arr) && arr.length > 0) {
      const n = arr.length;
      return n >= 100 ? `${n}+` : `${n}`;
    }

    const parsed = parseInt(String(fallback).replace(/\D/g, ""), 10);
    if (!Number.isNaN(parsed) && parsed > 0)
      return parsed >= 100 ? `${parsed}+` : `${parsed}`;

    return String(fallback);
  } catch (e) {
    return String(fallback);
  }
}

export default formatCountFromArray;
