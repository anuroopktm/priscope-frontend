import { logger } from "@/shared/utils/logger";

/**
 * HTTP methods supported by the API clients
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Base configuration for API requests
 */
export interface BaseRequestConfig {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  withAuth?: boolean;
  cache?: RequestCache;
  timeout?: number;
}

/**
 * Request context for logging and error handling
 */
export interface RequestContext {
  url: string;
  method: HttpMethod;
  endpoint: string;
  timestamp: number;
}

/**
 * Base API error class
 */
export class BaseApiError extends Error {
  readonly status: number;
  readonly body: any;
  readonly url: string;
  readonly context: RequestContext;

  constructor(
    message: string,
    status: number,
    body: any,
    context: RequestContext
  ) {
    super(message);
    this.name = "BaseApiError";
    this.status = status;
    this.body = body;
    this.url = context.url;
    this.context = context;
  }
}

/**
 * Centralized logging utilities
 */
export class ApiLogger {
  static logRequest(
    context: RequestContext,
    additionalData?: Record<string, any>,
    source?: "ssr" | "client"
  ): void {
    logger.info({
      message: "API Request",
      method: context.method,
      url: context.url,
      endpoint: context.endpoint,
      timestamp: context.timestamp,
      ...(source === "ssr" ? { ssr: true } : {}),
      ...(source === "client" ? { client: true } : {}),
      ...additionalData,
    });
  }

  static logResponse(
    context: RequestContext,
    status: number,
    duration: number,
    additionalData?: Record<string, any>,
    source?: "ssr" | "client"
  ): void {
    logger.info({
      message: "API Response",
      method: context.method,
      url: context.url,
      endpoint: context.endpoint,
      status,
      duration: `${duration}ms`,
      ...(source === "ssr" ? { ssr: true } : {}),
      ...(source === "client" ? { client: true } : {}),
      ...additionalData,
    });
  }

  static logError(
    context: RequestContext,
    error: any,
    additionalData?: Record<string, any>,
    source?: "ssr" | "client"
  ): void {
    const errorData = {
      message: "API Error",
      method: context.method,
      url: context.url,
      endpoint: context.endpoint,
      error: error instanceof Error ? error.message : String(error),
      status: error.status || error.response?.status || "Unknown",
      ...(source === "ssr" ? { ssr: true } : {}),
      ...(source === "client" ? { client: true } : {}),
      ...additionalData,
    };
    logger.error(errorData);
  }

  static logAuthWarning(
    endpoint: string,
    error: any,
    source?: "ssr" | "client"
  ): void {
    logger.warn({
      message: "Failed to retrieve session for API request",
      endpoint,
      error: error instanceof Error ? error.message : String(error),
      ...(source === "ssr" ? { ssr: true } : {}),
      ...(source === "client" ? { client: true } : {}),
    });
  }

  static logNetworkError(
    context: RequestContext,
    error: any,
    source?: "ssr" | "client"
  ): void {
    logger.error({
      message: "Network error in API request",
      method: context.method,
      url: context.url,
      endpoint: context.endpoint,
      error: error instanceof Error ? error.message : String(error),
      ...(source === "ssr" ? { ssr: true } : {}),
      ...(source === "client" ? { client: true } : {}),
    });
  }

  static logParseError(
    context: RequestContext,
    status: number,
    error: any,
    source?: "ssr" | "client"
  ): void {
    logger.error({
      message: "Failed to parse JSON response",
      method: context.method,
      url: context.url,
      endpoint: context.endpoint,
      status,
      error: error instanceof Error ? error.message : String(error),
      ...(source === "ssr" ? { ssr: true } : {}),
      ...(source === "client" ? { client: true } : {}),
    });
  }
}

/**
 * URL utilities
 */
export class UrlUtils {
  static buildUrl(baseUrl: string, endpoint: string): string {
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;
    const normalizedBase = baseUrl.endsWith("/")
      ? baseUrl.slice(0, -1)
      : baseUrl;
    return `${normalizedBase}/${normalizedEndpoint}`;
  }

  static createContext(
    url: string,
    method: HttpMethod,
    endpoint: string
  ): RequestContext {
    return {
      url,
      method,
      endpoint,
      timestamp: Date.now(),
    };
  }
}

/**
 * Request/Response utilities
 */
export class RequestUtils {
  static shouldIncludeBody(method: HttpMethod): boolean {
    return !["GET", "DELETE"].includes(method);
  }

  static serializeBody(body: any): string | undefined {
    if (!body) return undefined;
    return typeof body === "string" ? body : JSON.stringify(body);
  }

  static buildHeaders(
    customHeaders: Record<string, string> = {},
    includeJson: boolean = true
  ): Record<string, string> {
    const headers: Record<string, string> = { ...customHeaders };

    if (includeJson && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  }

  static extractErrorMessage(
    responseData: any,
    fallback: string = "Request failed"
  ): string {
    return (
      responseData?.message ||
      responseData?.error ||
      responseData?.errors?.[0]?.message ||
      fallback
    );
  }

  static isEmptyResponse(
    status: number,
    contentLength?: string | null
  ): boolean {
    return status === 204 || contentLength === "0";
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceUtils {
  static measureDuration(startTime: number): number {
    return Date.now() - startTime;
  }

  static createTimer(): { start: number; getDuration: () => number } {
    const start = Date.now();
    return {
      start,
      getDuration: () => Date.now() - start,
    };
  }
}

/**
 * Environment utilities
 */
export class EnvironmentUtils {
  static isServer(): boolean {
    return typeof window === "undefined";
  }

  static isClient(): boolean {
    return typeof window !== "undefined";
  }

  static validateServerSide(): void {
    if (!this.isServer()) {
      throw new Error(
        "This function can only be used on the server (SSR). For client-side API calls, use a client-safe method."
      );
    }
  }
}

/**
 * Generic resource client interface
 */
export interface ResourceClient<T = any> {
  get: <R = T>(id?: string, config?: any) => Promise<R>;
  post: <R = T>(data: any, config?: any) => Promise<R>;
  put: <R = T>(id: string, data: any, config?: any) => Promise<R>;
  patch: <R = T>(id: string, data: any, config?: any) => Promise<R>;
  delete: <R = T>(id: string, config?: any) => Promise<R>;
}

/**
 * Factory for creating resource clients
 */
export function createResourceClientFactory<T extends Record<string, string>>(
  endpoints: T,
  clientMethods: {
    get: (endpoint: string, config?: any) => Promise<any>;
    post: (endpoint: string, data?: any, config?: any) => Promise<any>;
    put: (endpoint: string, data?: any, config?: any) => Promise<any>;
    patch: (endpoint: string, data?: any, config?: any) => Promise<any>;
    delete: (endpoint: string, config?: any) => Promise<any>;
  }
): Record<keyof T, ResourceClient> {
  return Object.entries(endpoints).reduce((client, [key, endpoint]) => {
    client[key as keyof T] = {
      get: <R = any>(id?: string, config?: any) =>
        clientMethods.get(id ? `${endpoint}/${id}` : endpoint, config),

      post: <R = any>(data: any, config?: any) =>
        clientMethods.post(endpoint, data, config),

      put: <R = any>(id: string, data: any, config?: any) =>
        clientMethods.put(`${endpoint}/${id}`, data, config),

      patch: <R = any>(id: string, data: any, config?: any) =>
        clientMethods.patch(`${endpoint}/${id}`, data, config),

      delete: <R = any>(id: string, config?: any) =>
        clientMethods.delete(`${endpoint}/${id}`, config),
    };
    return client;
  }, {} as Record<keyof T, ResourceClient>);
}

/**
 * Constants
 */
export const DEFAULT_TIMEOUT = 10000; // 10 seconds
export const DEFAULT_CACHE_POLICY: RequestCache = "no-store";
