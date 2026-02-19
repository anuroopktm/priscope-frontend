import { SERVICE_BASE_URLS } from "@/shared/constants/app.constants";
import { resolveEndpoint } from "./resolveEndpoint";

/**
 * Extracts the service name from a pathname and returns the corresponding base URL.
 * Defaults to API_BASE_URL if no specific match is found.
 */
export function getBaseUrlForPath(pathname: string): string {
  const path = pathname.split("?")[0];
  const serviceKey = resolveEndpoint(path) || "";
  const baseUrl = SERVICE_BASE_URLS[serviceKey];

  return baseUrl ?? process.env.API_BASE_URL!;
}
