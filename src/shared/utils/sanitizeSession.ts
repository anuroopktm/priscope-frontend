import type { Session } from "next-auth";

export function sanitizeSession(
  session: Session | null | undefined
): Session | null {
  if (!session) return null;

  const { accessToken, ...rest } = session;
  return rest as Session;
}
