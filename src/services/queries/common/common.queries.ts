import { axiosInstance } from "@/services/api/axiosInstance";
import {
  useMutation,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  GlobalCurrenciesRequest,
  GlobalCurrenciesResponse,
} from "./types/currency.types";
import type {
  DownloadFileResponse,
  ExportRequest,
  ExportResponse,
  ListExportRequest,
  ListExportResponse,
} from "./types/exportServices.types";
import type {
  CreateItemGroupRequest,
  CreateItemGroupResponse,
  ItemGroupDetail,
  SearchItemGroupsRequest,
  SearchItemGroupsResponse,
} from "./types/item-group.types";

// ---------------------- DOWNLOAD TEMPLATE ----------------------

export const useGetTemplateFile = () => {
  return useMutation<any, AxiosError, string>({
    mutationFn: async (feature: string) => {
      const { data } = await axiosInstance.get(`/v1/common/template`, {
        params: { feature },
      });
      return data;
    },
    onSuccess: (data, feature) => {
      if (data?.url) {
        const link = document.createElement("a");
        link.href = data.url;
        link.setAttribute("download", `${feature}_template.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    },
    onError: (error) => {
      console.error("Failed to download template:", error);
    },
  });
};

// ---------------------- LIST MODULE IMPORTS ----------------------

export const useListModuleImports = (
  module_name: string,
  options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["module-imports", module_name],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/v1/common/uploads`, {
        params: { feature: module_name },
        headers: { "Content-Type": "application/json" },
      });
      return data;
    },
    enabled: Boolean(module_name),
    refetchOnWindowFocus: false,
    ...options,
  });
};

// ---------------------- IMPORT SUMMARY COUNT ----------------------

export const useListModuleImportSummaryCount = (
  uploadId: string,
  module_name: string,
) => {
  return useQuery<any, AxiosError>({
    queryKey: ["ModuleImportSummaryCount", module_name, uploadId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/v1/common/upload-summary/${uploadId}/counts`,
        {
          params: { feature: module_name },
          headers: { "Content-Type": "application/json" },
        },
      );
      return data;
    },
    enabled: Boolean(uploadId && module_name),
    refetchOnWindowFocus: false,
  });
};

// ---------------------- DOWNLOAD IMPORT ERROR FILE ----------------------

export const useGetModuleImportErrorFile = () => {
  return useMutation<any, AxiosError, string>({
    mutationFn: async (uploadId: string) => {
      const { data } = await axiosInstance.get(
        `/v1/common/uploads/${uploadId}/error-file`,
      );
      return data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        const link = document.createElement("a");
        link.href = data.url;
        link.setAttribute("download", "error_file.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    },
  });
};

// ---------------------- CREATE EXPORT ----------------------

export const useCreateExport = () => {
  return useMutation<
    ExportResponse,
    AxiosError<{ detail: string | string[] }>,
    ExportRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post<ExportResponse>(
        `/v1/exports`,
        payload,
      );
      return data;
    },
  });
};

// ---------------------- LIST EXPORTS ----------------------

export const useListExport = () => {
  return useMutation<
    ListExportResponse,
    AxiosError<{ detail: string | string[] }>,
    ListExportRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post<ListExportResponse>(
        `/v1/exports/search`,
        payload,
      );
      return data;
    },
  });
};

// ---------------------- DOWNLOAD EXPORTED FILE ----------------------

export const useGetExportedFile = () => {
  return useMutation<DownloadFileResponse, AxiosError, string>({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.get<DownloadFileResponse>(
        `/v1/exports/download/${id}`,
      );
      return data;
    },
  });
};

// ---------------------- LIST GLOBAL CURRENCIES ----------------------

export const useListCurrencies = (payload: GlobalCurrenciesRequest) => {
  return useQuery<GlobalCurrenciesResponse, AxiosError<{ detail: string }>>({
    queryKey: ["global-currencies", payload],
    queryFn: async () => {
      const { data } = await axiosInstance.post<GlobalCurrenciesResponse>(
        `/v1/global-currencies`,
        payload,
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });
};

// ---------------------- CREATE ITEM GROUP ----------------------

export const useCreateItemGroup = () => {
  return useMutation<
    CreateItemGroupResponse,
    AxiosError<{ detail: string | string[] }>,
    CreateItemGroupRequest
  >({
    mutationKey: ["create-item-group"],
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post<CreateItemGroupResponse>(
        `/v1/common/item-groups`,
        payload,
      );
      return data;
    },
  });
};

// ---------------------- SEARCH ITEM GROUPS ----------------------

export const useSearchItemGroups = (payload: SearchItemGroupsRequest) => {
  return useQuery<SearchItemGroupsResponse, AxiosError<{ detail: string }>>({
    queryKey: ["search-item-groups", payload],
    queryFn: async () => {
      const { data } = await axiosInstance.post<SearchItemGroupsResponse>(
        `/v1/common/item-groups/search`,
        payload,
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });
};

// ---------------------- GET ITEM GROUP BY ID ----------------------

export const useGetItemGroup = () => {
  return useMutation<ItemGroupDetail, AxiosError<{ detail: string }>, string>({
    mutationFn: async (groupId: string) => {
      const { data } = await axiosInstance.get<ItemGroupDetail>(
        `/v1/common/item-groups/${groupId}`,
      );
      return data;
    },
  });
};
