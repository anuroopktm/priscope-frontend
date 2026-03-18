import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axiosInstance";
import type { AxiosError } from "axios";
import type {
  CompanyInfoResponse,
  SystemFieldResponse,
  UpdateSystemFieldPayload,
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
  return useMutation<void, AxiosError<{ detail: string | string[] }>, FormData>(
    {
      mutationFn: async (payload: FormData) => {
        const response = await axiosInstance.patch(
          "/v1/global-settings/company-info",
          payload,
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
  return useQuery({
    queryKey: ["get-attributes"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/v1/global-settings/attributes",
      );
      return response.data;
    },
  });
};
