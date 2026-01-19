/**
 * Client-side authenticated fetch with automatic cookie handling
 */

/** Fetch with auth cookie - returns Response object */
export async function authFetchJson(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    credentials: "include", // Send HttpOnly cookie
  });

  return response;
}
