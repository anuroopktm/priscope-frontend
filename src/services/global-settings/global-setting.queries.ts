import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axiosInstance";
import type { AxiosError } from "axios";
import {
  type OperationsSettingsResponse,
  type AttributeResponseFields,
  type CompanyInfoResponse,
  type SystemFieldResponse,
  type UpdateAttributesFieldPayload,
  type UpdateSystemFieldPayload,
  type AlertsSettingsResponse,
} from "./global-settings.types";

export const useGetCompanyInfo = () => {
  return useQuery<
    void,
    AxiosError<{ detail: string | string[] }>,
    CompanyInfoResponse
  >({
    queryKey: ["get-company-info"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/v1/global-settings/company-info",
      );
      return response.data;
    },
  });
};

export const useUpdateCompanyInfo = () => {
  return useMutation<CompanyInfoResponse, AxiosError<{ detail: string | string[] }>, FormData>(
    {
      mutationFn: async (payload: FormData) => {
        const response = await axiosInstance.patch(
          "/v1/global-settings/company-info",
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        return response.data;
      },
    },
  );
};

export const useGetSystemFields = () => {
  return useQuery<
    void,
    AxiosError<{ detail: string | string[] }>,
    SystemFieldResponse
  >({
    queryKey: ["get-system-fields"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/v1/global-settings/system-fields",
      );
      return response.data;
    },
  });
};

export const useUpdateSystemFields = () => {
  return useMutation<
    void,
    AxiosError<{ detail: string | string[] }>,
    UpdateSystemFieldPayload
  >({
    mutationFn: async (payload: UpdateSystemFieldPayload) => {
      const response = await axiosInstance.patch(
        "/v1/global-settings/system-fields",
        payload,
      );
      return response.data;
    },
  });
};

export const useGetAttributes = () => {
  return useQuery<
    void,
    AxiosError<{ detail: string | string[] }>,
    AttributeResponseFields[]
  >({
    queryKey: ["get-attributes"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/v1/global-settings/attributes",
      );
      return response.data;
    },
  });
};

export const useUpdateAttributes = () => {
  return useMutation<
    void,
    AxiosError<{ detail: string | string[] }>,
    UpdateAttributesFieldPayload
  >({
    mutationFn: async (payload: UpdateAttributesFieldPayload) => {
      const response = await axiosInstance.patch(
        "/v1/global-settings/attributes",
        payload,
      );
      return response.data;
    },
  });
};

export const useGetOperationsSettings = () => {
  return useQuery<
    void,
    AxiosError<{ detail: string | string[] }>,
    OperationsSettingsResponse
  >({
    queryKey: ["get-operations-settings"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/v1/global-settings/system-identifier",
      );
      return response.data;
    },
  });
};

export const useUpdateOperationsSettings = () => {
  return useMutation<
    void,
    AxiosError<{ detail: string | string[] }>,
    OperationsSettingsResponse
  >({
    mutationFn: async (payload: OperationsSettingsResponse) => {
      const response = await axiosInstance.patch(
        "/v1/global-settings/system-identifier",
        payload,
      );
      return response.data;
    },
  });
};

export const useGetAlerts = () => {
  return useQuery<
    void,
    AxiosError<{ detail: string | string[] }>,
    AlertsSettingsResponse
  >({
    queryKey: ["get-alerts"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/v1/global-settings/alert-config",
      );
      return response.data;
    },
  });
};

export const useUpdateAlerts = () => {
  return useMutation<
    void,
    AxiosError<{ detail: string | string[] }>,
    AlertsSettingsResponse
  >({
    mutationFn: async (payload: AlertsSettingsResponse) => {
      const response = await axiosInstance.patch(
        "/v1/global-settings/alert-config",
        payload,
      );
      return response.data;
    },
  });
};
