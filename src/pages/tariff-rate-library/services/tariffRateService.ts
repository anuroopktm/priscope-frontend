import { useMutation, useQuery } from "@tanstack/react-query";
import { TARIFF_RATE_ENDPOINTS } from "../constants/api.endpoints";

import type {
  CreateTariffRateCommentParams,
  TariffRateCommentResponse,
  TariffRateCommentsRequest,
  TariffRateCreateRequest,
  TariffRateCreateResponse,
  TariffRateRequest,
  TariffRateResponse,
  UploadResponse,
} from "../types";

import type {
  BulkStatusUpdateRequest,
  BulkStatusUpdateResponse,
} from "../../freight-rate-library/types";
import { axiosInstance } from "@/services/api/axiosInstance";

export const useUploadFreightRateFile = () => {
  return useMutation<UploadResponse, Error, { file: File; updateIfExists: boolean }>({
    mutationFn: async (payload) => {
      const formData = new FormData();
      formData.append("file", payload.file);

      const response = await axiosInstance.post<UploadResponse>(
        `${TARIFF_RATE_ENDPOINTS.upload()}?feature=tariff_rate&update_if_exists=${payload.updateIfExists}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
        }
      );

      return response.data;
    },
  });
};

export const useListTariffRates = (payload: TariffRateRequest) => {
  return useQuery<TariffRateResponse>({
    queryKey: ["pagedData", payload.skip, payload.search],
    queryFn: async () => {
      const response = await axiosInstance.post<TariffRateResponse>(
        TARIFF_RATE_ENDPOINTS.getTariffRates,
        payload,
        {
          timeout: 60000,
        }
      );

      return response.data;
    },
  });
};

export const useGetTariffRateById = () => {
  return useMutation<any, Error, string>({
    mutationFn: async (tariffRateId) => {
      const response = await axiosInstance.get<any>(
        TARIFF_RATE_ENDPOINTS.getTariffRateById(tariffRateId),
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000,
        }
      );

      return response.data;
    },
  });
};

export const useListTariffRateComments = (payload: TariffRateCommentsRequest) => {
  return useQuery<any>({
    queryKey: ["TariffRateComments", payload],
    queryFn: async () => {
      const response = await axiosInstance.post<any>(
        TARIFF_RATE_ENDPOINTS.getTariffRateComments,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000,
        }
      );

      return response.data;
    },
    enabled: !!payload.tenant_id,
  });
};

export const useTariffRateHistory = (
  tariffRateId: string,
  params: { skip?: number; limit?: number; search?: string }
) => {
  return useQuery<any>({
    queryKey: ["TariffRateHistory", tariffRateId, params],
    queryFn: async () => {
      const response = await axiosInstance.post<any>(
        TARIFF_RATE_ENDPOINTS.getTariffRateHistory(tariffRateId),
        {
          skip: params.skip ?? 0,
          limit: params.limit ?? 10,
          search: params.search ?? "",
        }
      );

      return response.data;
    },
  });
};

export const useTariffRateChanges = (
  tariffRateId: string,
  params: { skip?: number; limit?: number; search?: string }
) => {
  return useQuery<any>({
    queryKey: ["TariffRateChanges", tariffRateId, params],
    queryFn: async () => {
      const response = await axiosInstance.post<any>(
        TARIFF_RATE_ENDPOINTS.getTariffRateChanges(tariffRateId),
        {
          skip: params.skip ?? 0,
          limit: params.limit ?? 10,
          search: params.search ?? "",
        }
      );

      return response.data;
    },
  });
};

export const useCreateTariffRate = () => {
  return useMutation<TariffRateCreateResponse, Error, TariffRateCreateRequest>({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post<TariffRateCreateResponse>(
        TARIFF_RATE_ENDPOINTS.createTariffRate,
        payload,
        {
          timeout: 60000,
        }
      );

      return response.data;
    },
  });
};

export const useGetTariffRateErrorFile = () => {
  return useMutation<any, Error, string>({
    mutationFn: async (uploadId) => {
      const response = await axiosInstance.get<any>(
        TARIFF_RATE_ENDPOINTS.getTariffRateErrorFile(uploadId)
      );

      return response.data;
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

export const useListTariffRateUploadSummaryCount = (uploadId: string) => {
  return useQuery<any>({
    queryKey: ["TariffRateUploadSummaryCount", uploadId],
    queryFn: async () => {
      const response = await axiosInstance.get<any>(
        TARIFF_RATE_ENDPOINTS.getTariffRateUploadSummaryCounts(uploadId),
        {
          params: {
            feature: "tariff_rate",
          },
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000,
        }
      );

      return response.data;
    },
  });
};

export const useListTariffRateUploads = () => {
  return useMutation<any, Error, void>({
    mutationFn: async () => {
      const response = await axiosInstance.get<any>(
        TARIFF_RATE_ENDPOINTS.getTariffRateUploads,
        {
          params: {
            feature: "tariff_rate",
          },
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000,
        }
      );

      return response.data;
    },
  });
};

export const useUpdateTariffRate = () => {
  return useMutation<any, Error, { tariffRateId: string; payload: any }>({
    mutationFn: async (props) => {
      const response = await axiosInstance.put<any>(
        TARIFF_RATE_ENDPOINTS.updateTariffRate(props.tariffRateId),
        props.payload
      );

      return response.data;
    },
  });
};

export const useBulkStatusUpdate = () => {
  return useMutation<
    BulkStatusUpdateResponse,
    Error,
    BulkStatusUpdateRequest
  >({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post<BulkStatusUpdateResponse>(
        TARIFF_RATE_ENDPOINTS.bulkStatusUpdate,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000,
        }
      );

      return response.data;
    },
  });
};

export const useCreateAdminRequest = () => {
  return useMutation<any, Error, any>({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post<any>(
        TARIFF_RATE_ENDPOINTS.createAdminRequest,
        payload,
        {
          timeout: 60000,
        }
      );

      return response.data;
    },
  });
};

export const useCreateTariffRateComment = () => {
  return useMutation<
    TariffRateCommentResponse,
    Error,
    CreateTariffRateCommentParams
  >({
    mutationFn: async ({ payload, tariffRateId }) => {
      const response = await axiosInstance.post<TariffRateCommentResponse>(
        TARIFF_RATE_ENDPOINTS.saveTariffRateComment(tariffRateId),
        payload,
        {
          timeout: 60000,
        }
      );

      return response.data;
    },
  });
};