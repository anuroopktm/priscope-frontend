import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";
import {
  BaseApiError,
  RequestContext,
  ApiLogger,
  UrlUtils,
  RequestUtils,
  PerformanceUtils,
  createResourceClientFactory,
  DEFAULT_TIMEOUT,
} from "./api-core";
import { INTERNAL_API_BASE_PATH } from "@/shared/constants/app.constants";
/**
 * Client-specific API error
 */
export class ClientApiError extends BaseApiError {
  constructor(
    message: string,
    status: number,
    body: any,
    context: RequestContext
  ) {
    super(message, status, body, context);
    this.name = "ClientApiError";
  }
}

/**
 * Axios interceptor handlers
 */
class AxiosInterceptors {
  static async onRequest(
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> {
    const context = UrlUtils.createContext(
      config.url || "",
      (config.method?.toUpperCase() as any) || "GET",
      config.url || ""
    );

    // ApiLogger.logRequest(context, {
    //   baseURL: config.baseURL,
    // });

    return config;
  }

  static onRequestError(error: AxiosError): Promise<never> {
    const context = UrlUtils.createContext(
      error.config?.url || "",
      (error.config?.method?.toUpperCase() as any) || "GET",
      error.config?.url || ""
    );

    ApiLogger.logError(context, error, {
      type: "request_error",
      stack: error.stack,
    }, 'client');

    return Promise.reject(error);
  }

  static onResponse(response: AxiosResponse): AxiosResponse {
    const context = UrlUtils.createContext(
      response.config.url || "",
      (response.config.method?.toUpperCase() as any) || "GET",
      response.config.url || ""
    );

    // uncomment the following line to log the response
    // ApiLogger.logResponse(context, response.status, 0, undefined, 'client');

    return response;
  }

  static onResponseError(error: AxiosError): Promise<never> {
    const context = UrlUtils.createContext(
      error.config?.url || "",
      (error.config?.method?.toUpperCase() as any) || "GET",
      error.config?.url || ""
    );

    ApiLogger.logError(context, error, {
      type: "response_error",
      data: error.response?.data,
    }, 'client');

    // Transform to custom error
    const apiError = new ClientApiError(
      RequestUtils.extractErrorMessage(error.response?.data, error.message),
      error.response?.status || 0,
      error.response?.data,
      context
    );

    return Promise.reject(apiError);
  }
}

/**
 * Axios client factory
 */
class AxiosClientFactory {
  static create(
    baseURL: string,
    config: AxiosRequestConfig = {}
  ): AxiosInstance {
    const instance = axios.create({
      baseURL,
      timeout: DEFAULT_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    });

    // Setup interceptors
    instance.interceptors.request.use(
      AxiosInterceptors.onRequest,
      AxiosInterceptors.onRequestError
    );

    instance.interceptors.response.use(
      AxiosInterceptors.onResponse,
      AxiosInterceptors.onResponseError
    );

    return instance;
  }
}

/**
 * Generic Axios API wrapper
 */
export class AxiosApiClient {
  constructor(private readonly client: AxiosInstance) {}

  async get<T = any>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.get<T>(endpoint, config);
    return response.data;
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(endpoint, data, config);
    return response.data;
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(endpoint, data, config);
    return response.data;
  }

  async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<T>(endpoint, data, config);
    return response.data;
  }

  async delete<T = any>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.delete<T>(endpoint, config);
    return response.data;
  }

  /**
   * Get the underlying Axios instance for advanced usage
   */
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

/**
 * Default client instances
 */
export const defaultAxiosClient = AxiosClientFactory.create(`${INTERNAL_API_BASE_PATH}/proxy`);
export const clientApi = new AxiosApiClient(defaultAxiosClient);

/**
 * Convenience methods for direct usage
 */
export const restApi = {
  get: <T = any>(endpoint: string, config?: AxiosRequestConfig) =>
    clientApi.get<T>(endpoint, config),

  post: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig) =>
    clientApi.post<T>(endpoint, data, config),

  put: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig) =>
    clientApi.put<T>(endpoint, data, config),

  patch: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig) =>
    clientApi.patch<T>(endpoint, data, config),

  delete: <T = any>(endpoint: string, config?: AxiosRequestConfig) =>
    clientApi.delete<T>(endpoint, config),
} as const;

/**
 * Create client resource client
 */
export function createClientResourceClient<T extends Record<string, string>>(
  endpoints: T,
  client: AxiosApiClient = clientApi
) {
  return createResourceClientFactory(endpoints, {
    get: (endpoint, config) => client.get(endpoint, config),
    post: (endpoint, data, config) => client.post(endpoint, data, config),
    put: (endpoint, data, config) => client.put(endpoint, data, config),
    patch: (endpoint, data, config) => client.patch(endpoint, data, config),
    delete: (endpoint, config) => client.delete(endpoint, config),
  });
}

/**
 * Create multiple client instances for different services
 */
export function createMultiClient(
  configs: Record<string, string | AxiosRequestConfig>
) {
  return Object.entries(configs).reduce((clients, [name, config]) => {
    const axiosConfig =
      typeof config === "string" ? { baseURL: config } : config;

    const instance = AxiosClientFactory.create(
      axiosConfig.baseURL || "",
      axiosConfig
    );
    clients[name] = new AxiosApiClient(instance);
    return clients;
  }, {} as Record<string, AxiosApiClient>);
}

/**
 * Create client with custom configuration
 */
export function createCustomClient(
  baseURL: string,
  config?: AxiosRequestConfig
): AxiosApiClient {
  const instance = AxiosClientFactory.create(baseURL, config);
  return new AxiosApiClient(instance);
}

export { ClientApiError as ApiError };
