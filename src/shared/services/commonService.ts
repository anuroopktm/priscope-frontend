import {
  COMMON_ENDPOINTS,
  EXPORT_RATE_ENDPOINTS,
  IMPORT_RATE_ENDPOINTS,
} from "../constants/api.endpoints";
import {
  DownloadFileResponse,
  ExportRequest,
  ExportResponse,
  ListExportRequest,
} from "../types/exportServices.types";
import { api } from "../utils/api";
import { createMutation, createQuery } from "../utils/reactQueryUtils";
import { ListExportResponse } from "../types/exportServices.types";

export const useGetTemplateFile = () => {
  return createMutation<any, string>(
    async (feature: string) => {
      return api.get<any>(COMMON_ENDPOINTS.getRateTemplate, {
        params: {
          feature: feature,
        },
      });
    },
    {
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
    },
  );
};

export const useListModuleImports = (module_name: string) =>
  createMutation<any>(() =>
    api.get<any>(IMPORT_RATE_ENDPOINTS.getModuleImports, {
      params: { feature: module_name },
      headers: { "Content-Type": "application/json" },
      timeout: 60000,
    }),
  );

export const useListModuleImportSummaryCount = (
  uploadId: string,
  module_name: string,
) =>
  createQuery<any>(["ModuleImportSummaryCount", module_name, uploadId], () =>
    api.get<any>(IMPORT_RATE_ENDPOINTS.getModuleImportSummaryCount(uploadId), {
      params: { feature: module_name },
      headers: { "Content-Type": "application/json" },
      timeout: 60000,
    }),
  );

export const useGetModuleImportErrorFile = () =>
  createMutation<any, string>(
    async (uploadId: string) => {
      return api.get<any>(
        IMPORT_RATE_ENDPOINTS.getModuleImportErrorFile(uploadId),
      );
    },
    {
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
    },
  );

export const useCreateExport = () =>
  createMutation<ExportResponse, ExportRequest>((payload) =>
    api.post<ExportResponse>(EXPORT_RATE_ENDPOINTS.createExport, payload, {
      timeout: 60000,
    }),
  );

export const useListExport = () =>
  createMutation<ListExportResponse, ListExportRequest>((payload) =>
    api.post<ListExportResponse>(EXPORT_RATE_ENDPOINTS.listExports, payload, {
      timeout: 60000,
    }),
  );

export const useGetExportedFile = () =>
  createMutation<DownloadFileResponse, string>((id) =>
    api.get<DownloadFileResponse>(EXPORT_RATE_ENDPOINTS.downloadExportFile(id)),
  );
