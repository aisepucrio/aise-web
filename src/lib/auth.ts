// Valida Bearer token do header Authorization
export function requireBearer(authHeader: string | null): boolean {
  if (!authHeader) return false;
  const [type, token] = authHeader.split(" ");
  return type === "Bearer" && !!token && token === process.env.ADMIN_TOKEN;
}
