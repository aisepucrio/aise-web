/**
 * Client-side authenticated fetch with automatic cookie handling
 */

/** Fetch JSON with auth cookie - throws error with status code on failure */
export async function authFetchJson<T = any>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: "include", // Send HttpOnly cookie
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const err = new Error(error.error || "Request failed") as Error & {
      status: number;
    };
    err.status = response.status;
    throw err;
  }

  return response.json();
}
