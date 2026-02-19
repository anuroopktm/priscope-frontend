import {
  BaseApiError,
  BaseRequestConfig,
  RequestContext,
  ApiLogger,
  UrlUtils,
  RequestUtils,
  PerformanceUtils,
  EnvironmentUtils,
  createResourceClientFactory,
  DEFAULT_CACHE_POLICY,
} from "./api-core";
import { getRequestCookieHeader } from "../getRequestCookies";
import { INTERNAL_API_BASE_PATH } from "@/shared/constants/app.constants";

// SSR-specific API error
export class SsrApiError extends BaseApiError {
  constructor(
    message: string,
    status: number,
    body: any,
    context: RequestContext
  ) {
    super(message, status, body, context);
    this.name = "SsrApiError";
  }
}

interface SsrRequestConfig extends BaseRequestConfig {
  cache?: RequestCache;
}

// Helper to get absolute URL for server-side
const getAbsoluteUrl = (path: string): string => {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

class SsrHttpClient {
  private readonly baseUrl: string;

  constructor(basePath: string = `${INTERNAL_API_BASE_PATH}/proxy`) {
    this.baseUrl = getAbsoluteUrl(basePath);
  }

  private async makeRequest(
    endpoint: string,
    config: SsrRequestConfig = {}
  ): Promise<Response> {
    const {
      method = "GET",
      body,
      cache = DEFAULT_CACHE_POLICY,
      headers: customHeaders = {},
    } = config;

    const url = UrlUtils.buildUrl(this.baseUrl, endpoint);
    const context = UrlUtils.createContext(url, method, endpoint);
    const timer = PerformanceUtils.createTimer();

    const headers = RequestUtils.buildHeaders(customHeaders);

    const requestBody = RequestUtils.shouldIncludeBody(method)
      ? RequestUtils.serializeBody(body)
      : undefined;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: requestBody,
        cache,
      });

      ApiLogger.logResponse(
        context,
        response.status,
        timer.getDuration(),
        undefined,
        "ssr"
      );
      return response;
    } catch (networkError) {
      ApiLogger.logNetworkError(context, networkError, "ssr");
      throw new SsrApiError(
        `Network error: ${
          networkError instanceof Error
            ? networkError.message
            : String(networkError)
        }`,
        0,
        null,
        context
      );
    }
  }

  private async parseResponse(
    response: Response,
    context: RequestContext
  ): Promise<any> {
    if (
      RequestUtils.isEmptyResponse(
        response.status,
        response.headers.get("content-length")
      )
    ) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    try {
      if (contentType.includes("application/json")) {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
      } else if (contentType.startsWith("text/")) {
        return await response.text();
      } else {
        // For binary or unknown types, return the raw buffer
        return await response.arrayBuffer();
      }
    } catch (parseError) {
      ApiLogger.logParseError(context, response.status, parseError, "ssr");
      throw new SsrApiError(
        "Invalid response format",
        response.status,
        null,
        context
      );
    }
  }

  private validateResponse(
    response: Response,
    responseData: any,
    context: RequestContext
  ): void {
    if (!response.ok) {
      const errorMessage = RequestUtils.extractErrorMessage(
        responseData,
        response.statusText
      );

      ApiLogger.logError(context, {
        status: response.status,
        message: errorMessage,
        body: responseData,
      });

      throw new SsrApiError(
        errorMessage,
        response.status,
        responseData,
        context
      );
    }
  }

  async request<T = any>(
    endpoint: string,
    config: SsrRequestConfig = {}
  ): Promise<T> {
    EnvironmentUtils.validateServerSide();

    const response = await this.makeRequest(endpoint, config);
    const context = UrlUtils.createContext(
      UrlUtils.buildUrl(this.baseUrl, endpoint),
      config.method || "GET",
      endpoint
    );
    const responseData = await this.parseResponse(response, context);
    this.validateResponse(response, responseData, context);

    return responseData as T;
  }
}

const ssrClient = new SsrHttpClient();

export async function fetchWrapper<T = any>(
  endpoint: string,
  config: SsrRequestConfig = {}
): Promise<T> {
  const cookieHeader = await getRequestCookieHeader();

  config.headers = {
    ...config.headers,
    cookie: cookieHeader,
  };

  return ssrClient.request<T>(endpoint, config);
}

export const ssrApi = {
  get: <T = any>(endpoint: string, config?: Omit<SsrRequestConfig, "method">) =>
    fetchWrapper<T>(endpoint, { ...config, method: "GET" }),

  post: <T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<SsrRequestConfig, "method" | "body">
  ) => fetchWrapper<T>(endpoint, { ...config, method: "POST", body }),

  put: <T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<SsrRequestConfig, "method" | "body">
  ) => fetchWrapper<T>(endpoint, { ...config, method: "PUT", body }),

  patch: <T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<SsrRequestConfig, "method" | "body">
  ) => fetchWrapper<T>(endpoint, { ...config, method: "PATCH", body }),

  delete: <T = any>(
    endpoint: string,
    config?: Omit<SsrRequestConfig, "method">
  ) => fetchWrapper<T>(endpoint, { ...config, method: "DELETE" }),
} as const;

export function createSsrResourceClient<T extends Record<string, string>>(
  endpoints: T
) {
  return createResourceClientFactory(endpoints, {
    get: (endpoint, config) => ssrApi.get(endpoint, config),
    post: (endpoint, data, config) => ssrApi.post(endpoint, data, config),
    put: (endpoint, data, config) => ssrApi.put(endpoint, data, config),
    patch: (endpoint, data, config) => ssrApi.patch(endpoint, data, config),
    delete: (endpoint, config) => ssrApi.delete(endpoint, config),
  });
}

export { SsrApiError as ApiError };
