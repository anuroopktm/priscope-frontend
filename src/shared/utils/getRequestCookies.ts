"use server";

import { cookies } from "next/headers";

export async function getRequestCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString();
}
