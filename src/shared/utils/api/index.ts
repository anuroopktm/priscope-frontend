import { EnvironmentUtils } from "./api-core";

// Type of shared API methods
type ApiMethod = <T = unknown>(...args: any[]) => Promise<T>;

type ApiModule = {
  get: ApiMethod;
  post: ApiMethod;
  put: ApiMethod;
  patch: ApiMethod;
  delete: ApiMethod;
};

// Lazy-loaded SSR modules
let ssrApi: ApiModule | null = null;
let createSsrResourceClient: any = null;

// Lazy-loaded Client modules
let restApi: ApiModule | null = null;
let createClientResourceClient: any = null;
let createMultiClient: any = null;

async function loadSsrModules() {
  if (!ssrApi) {
    const ssrModule = await import("./ssr-fetch");
    ssrApi = ssrModule.ssrApi;
    createSsrResourceClient = ssrModule.createSsrResourceClient;
  }
  return { ssrApi, createSsrResourceClient };
}

async function loadClientModules() {
  if (!restApi) {
    const clientModule = await import("./client-api");
    restApi = clientModule.restApi;
    createClientResourceClient = clientModule.createClientResourceClient;
    createMultiClient = clientModule.createMultiClient;
  }
  return { restApi, createClientResourceClient, createMultiClient };
}

const callApiMethod = async <T = unknown>(
  method: keyof ApiModule,
  ...args: any[]
): Promise<T> => {
  if (EnvironmentUtils.isServer()) {
    const { ssrApi } = await loadSsrModules();
    return ssrApi![method]<T>(...args);
  } else {
    const { restApi } = await loadClientModules();
    return restApi![method]<T>(...args);
  }
};

export const api = {
  get: <T = unknown>(endpoint: string, config?: any): Promise<T> =>
    callApiMethod<T>("get", endpoint, config),

  post: <T = unknown>(endpoint: string, data?: any, config?: any): Promise<T> =>
    callApiMethod<T>("post", endpoint, data, config),

  put: <T = unknown>(endpoint: string, data?: any, config?: any): Promise<T> =>
    callApiMethod<T>("put", endpoint, data, config),

  patch: <T = unknown>(endpoint: string, data?: any, config?: any): Promise<T> =>
    callApiMethod<T>("patch", endpoint, data, config),

  delete: <T = unknown>(endpoint: string, config?: any): Promise<T> =>
    callApiMethod<T>("delete", endpoint, config),
};

export async function createResourceClient<T extends Record<string, string>>(
  endpoints: T
) {
  if (EnvironmentUtils.isServer()) {
    const { createSsrResourceClient } = await loadSsrModules();
    return createSsrResourceClient(endpoints);
  } else {
    const { createClientResourceClient } = await loadClientModules();
    return createClientResourceClient(endpoints);
  }
}

export const ssr = {
  async getApi(): Promise<ApiModule> {
    const { ssrApi } = await loadSsrModules();
    return ssrApi!;
  },
  async createResourceClient<T extends Record<string, string>>(endpoints: T) {
    const { createSsrResourceClient } = await loadSsrModules();
    return createSsrResourceClient(endpoints);
  },
};

export const client = {
  async getApi(): Promise<ApiModule> {
    const { restApi } = await loadClientModules();
    return restApi!;
  },
  async createResourceClient<T extends Record<string, string>>(endpoints: T) {
    const { createClientResourceClient } = await loadClientModules();
    return createClientResourceClient(endpoints);
  },
  async createMultiClient(configs: Record<string, string>) {
    const { createMultiClient } = await loadClientModules();
    return createMultiClient(configs);
  },
};

export type {
  HttpMethod,
  BaseRequestConfig,
  RequestContext,
  ResourceClient,
} from "./api-core";