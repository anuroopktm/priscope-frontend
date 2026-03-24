import { useMutation, useQuery } from "@tanstack/react-query";
import { FREIGHT_RATE_ENDPOINTS } from "../constants/api.endpoints";
import type {
  BulkStatusUpdateRequest,
  BulkStatusUpdateResponse,
  ContainerTypeCreateRequest,
  ContainerTypeCreateResponse,
  ContainerTypesRequest,
  ContainerTypesResponse,
  CreateFreightRateCommentParams,
  CreateFreightRateCommentResponse,
  FreightRateCommentsRequest,
  FreightRateCreateRequest,
  FreightRateCreateResponse,
  FreightRateRequest,
  FreightRateResponse,
  GlobalCurrenciesRequest,
  GlobalCurrenciesResponse,
  UploadResponse,
} from "../types";
import { axiosInstance } from "@/services/api/axiosInstance";

export const useUploadFreightRateFile = () => {
  return useMutation<
    UploadResponse,
    Error,
    { file: File; updateIfExists: boolean }
  >({
    mutationFn: async (payload) => {
      const formData = new FormData();
      formData.append("file", payload.file);

      const response = await axiosInstance.post<UploadResponse>(
        `${FREIGHT_RATE_ENDPOINTS.upload()}?feature=freight_rate&update_if_exists=${payload.updateIfExists}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
        },
      );

      return response.data;
    },
  });
};

export const useListFreightRates = (payload: FreightRateRequest) => {
  return useQuery<FreightRateResponse>({
    queryKey: ["listFreightRates", payload.skip, payload.search],
    queryFn: async () => {
      const response = await axiosInstance.post<FreightRateResponse>(
        FREIGHT_RATE_ENDPOINTS.getFreightRates,
        payload,
        {
          timeout: 60000,
        },
      );

      return response.data;
    },
  });
};

export const useGetFreightRateById = () => {
  return useMutation<any, Error, string>({
    mutationFn: async (freightRateId) => {
      const response = await axiosInstance.get<any>(
        FREIGHT_RATE_ENDPOINTS.getFreightRateById(freightRateId),
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000,
        },
      );

      return response.data;
    },
  });
};

export const useCreateFreightRate = () => {
  return useMutation<
    FreightRateCreateResponse,
    Error,
    FreightRateCreateRequest
  >({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post<FreightRateCreateResponse>(
        FREIGHT_RATE_ENDPOINTS.createFreightRate,
        payload,
        {
          timeout: 60000,
        },
      );

      return response.data;
    },
  });
};

export const useListContainerTypes = (payload: ContainerTypesRequest) => {
  return useQuery<ContainerTypesResponse>({
    queryKey: ["containerTypes", payload?.tenant_id, payload?.search],
    queryFn: async () => {
      const response = await axiosInstance.post<ContainerTypesResponse>(
        FREIGHT_RATE_ENDPOINTS.getContainerTypes,
        payload,
        {
          timeout: 60000,
        },
      );

      return response.data;
    },
  });
};

export const useListGlobalCurrencies = (payload: GlobalCurrenciesRequest) => {
  return useQuery<GlobalCurrenciesResponse>({
    queryKey: ["globalCurrencies", payload.skip, payload.search],
    queryFn: async () => {
      const response = await axiosInstance.post<GlobalCurrenciesResponse>(
        FREIGHT_RATE_ENDPOINTS.getGlobalCurrencies,
        payload,
        {
          timeout: 60000,
        },
      );

      return response.data;
    },
  });
};

export const useListFreightRateUploads = () => {
  return useMutation<any, Error, void>({
    mutationFn: async () => {
      const response = await axiosInstance.get<any>(
        FREIGHT_RATE_ENDPOINTS.getFreightRateUploads,
        {
          params: {
            feature: "freight_rate",
          },
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000,
        },
      );

      return response.data;
    },
  });
};

export const useListFreightRateUploadSummaryCount = (uploadId: string) => {
  return useQuery<any>({
    queryKey: ["FreightRateUploadSummaryCount", uploadId],
    queryFn: async () => {
      const response = await axiosInstance.get<any>(
        FREIGHT_RATE_ENDPOINTS.getFreightRateUploadSummaryCounts(uploadId),
        {
          params: {
            feature: "freight_rate",
          },
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000,
        },
      );

      return response.data;
    },
  });
};

export const useGetFreightRateErrorFile = () => {
  return useMutation<any, Error, string>({
    mutationFn: async (uploadId) => {
      const response = await axiosInstance.get<any>(
        FREIGHT_RATE_ENDPOINTS.getFreightRateErrorFile(uploadId),
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

export const useCreateContainerType = () => {
  return useMutation<
    ContainerTypeCreateResponse,
    Error,
    ContainerTypeCreateRequest
  >({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post<ContainerTypeCreateResponse>(
        FREIGHT_RATE_ENDPOINTS.createContainerType,
        payload,
      );

      return response.data;
    },
  });
};

export const useFreightRateHistory = (
  freightRateId: string,
  params: { skip?: number; limit?: number; search?: string },
) => {
  return useQuery<any>({
    queryKey: ["FreightRateHistory", freightRateId, params],
    queryFn: async () => {
      const response = await axiosInstance.post<any>(
        FREIGHT_RATE_ENDPOINTS.getFreightRateHistory(freightRateId),
        {
          skip: params.skip ?? 0,
          limit: params.limit ?? 10,
          search: params.search ?? "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000,
        },
      );

      return response.data;
    },
  });
};

export const useFreightRateChanges = (
  freightRateId: string,
  params: { skip?: number; limit?: number; search?: string },
) => {
  return useQuery<any>({
    queryKey: ["FreightRateChanges", freightRateId, params],
    queryFn: async () => {
      const response = await axiosInstance.post<any>(
        FREIGHT_RATE_ENDPOINTS.getFreightRateChanges(freightRateId),
        {
          skip: params.skip ?? 0,
          limit: params.limit ?? 10,
          search: params.search ?? "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000,
        },
      );

      return response.data;
    },
  });
};

export const useUpdateFrieghtRate = () => {
  return useMutation<any, Error, { freightRateId: string; payload: any }>({
    mutationFn: async (props) => {
      const response = await axiosInstance.put<any>(
        FREIGHT_RATE_ENDPOINTS.updateFreightRate(props.freightRateId),
        props.payload,
      );

      return response.data;
    },
  });
};

export const useBulkStatusUpdate = () => {
  return useMutation<BulkStatusUpdateResponse, Error, BulkStatusUpdateRequest>({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post<BulkStatusUpdateResponse>(
        FREIGHT_RATE_ENDPOINTS.bulkStatusUpdate,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000,
        },
      );

      return response.data;
    },
  });
};

export const useListFreightRateComments = (
  payload: FreightRateCommentsRequest,
) => {
  return useQuery<any>({
    queryKey: ["FreightRateComments", payload],
    queryFn: async () => {
      const response = await axiosInstance.post<any>(
        FREIGHT_RATE_ENDPOINTS.getFreightRateComments,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000,
        },
      );

      return response.data;
    },
    enabled: !!payload.tenant_id,
  });
};

export const useCreateFreightRateComment = () => {
  return useMutation<
    CreateFreightRateCommentResponse,
    Error,
    CreateFreightRateCommentParams
  >({
    mutationFn: async ({ payload, freightRateId }) => {
      const response =
        await axiosInstance.post<CreateFreightRateCommentResponse>(
          FREIGHT_RATE_ENDPOINTS.saveFreightRateComment(freightRateId),
          payload,
          {
            timeout: 60000,
          },
        );

      return response.data;
    },
  });
};

export const useCreateAdminRequest = () => {
  return useMutation<any, Error, any>({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post<any>(
        FREIGHT_RATE_ENDPOINTS.createAdminRequest,
        payload,
        {
          timeout: 60000,
        },
      );

      return response.data;
    },
  });
};

export const useListApprovalRequests = () => {
  return useMutation<
    any,
    Error,
    {
      tenant_id: string;
      search?: string;
      filter?: Record<string, any>;
      page_size?: number;
      skip?: number;
    }
  >({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post<any>(
        FREIGHT_RATE_ENDPOINTS.approvalRequests,
        payload,
      );

      return response.data;
    },
  });
};
