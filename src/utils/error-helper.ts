import type { AxiosError } from "axios";

/**
 * Extracts a human-readable error message from an AxiosError.
 * Looks for 'detail' in the response data, which can be a string or an array of strings.
 */
export const getErrorMessage = (
  error: any,
  fallback: string = "An unexpected error occurred",
): string => {
  const axiosError = error as AxiosError<{ detail: string | string[] }>;
  const detail = axiosError?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail[0] || fallback;
  }

  if (typeof detail === "string") {
    return detail || fallback;
  }

  return fallback;
};
