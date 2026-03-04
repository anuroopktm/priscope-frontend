import { axiosInstance } from "@/services/api/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  FreightRatesSearchParams,
  FreightRatesSearchResponse,
} from "./freight.types";

export const useListApprovalRequests = () => {
  return useMutation<
    any,
    AxiosError<{ detail: string | string[] }>,
    {
      tenant_id: string;
      search?: string;
      filter?: Record<string, any>;
      page_size?: number;
      skip?: number;
    }
  >({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post(
        `/v1/approval-requests/search`,
        payload,
      );
      return response.data;
    },
  });
};

export const useSearchFreightRates = (params: FreightRatesSearchParams) => {
  return useQuery<FreightRatesSearchResponse, AxiosError>({
    queryKey: ["freight-rates", "search", params],
    queryFn: async () => {
      const response = await axiosInstance.post(
        `/v1/freight-rates/search`,
        params,
      );
      return response.data;
    },
  });
};
