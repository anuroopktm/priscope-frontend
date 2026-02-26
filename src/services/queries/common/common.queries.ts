import { axiosInstance } from "@/services/api/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  COMMON_ENDPOINTS,
  EXPORT_RATE_ENDPOINTS,
  IMPORT_RATE_ENDPOINTS,
} from "./api.endpoints";
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

// ---------------------- DOWNLOAD TEMPLATE ----------------------

export const useGetTemplateFile = () => {
  return useMutation<any, AxiosError, string>({
    mutationFn: async (feature: string) => {
      const { data } = await axiosInstance.get(
        COMMON_ENDPOINTS.getRateTemplate,
        {
          params: { feature },
        },
      );
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

export const useListModuleImports = (module_name: string) => {
  return useMutation<any, AxiosError>({
    // queryKey: ["module-imports", module_name],
    mutationFn: async () => {
      const { data } = await axiosInstance.get(
        IMPORT_RATE_ENDPOINTS.getModuleImports,
        {
          params: { feature: module_name },
          headers: { "Content-Type": "application/json" },
        },
      );
      return data;
    },
    // enabled: Boolean(module_name),
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
        IMPORT_RATE_ENDPOINTS.getModuleImportSummaryCount(uploadId),
        {
          params: { feature: module_name },
          headers: { "Content-Type": "application/json" },
        },
      );
      return data;
    },
    enabled: Boolean(uploadId && module_name),
  });
};

// ---------------------- DOWNLOAD IMPORT ERROR FILE ----------------------

export const useGetModuleImportErrorFile = () => {
  return useMutation<any, AxiosError, string>({
    mutationFn: async (uploadId: string) => {
      const { data } = await axiosInstance.get(
        IMPORT_RATE_ENDPOINTS.getModuleImportErrorFile(uploadId),
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
        EXPORT_RATE_ENDPOINTS.createExport,
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
        EXPORT_RATE_ENDPOINTS.listExports,
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
        EXPORT_RATE_ENDPOINTS.downloadExportFile(id),
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
        COMMON_ENDPOINTS.globalCurrencies,
        payload,
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });
};
