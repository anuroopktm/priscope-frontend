import { axiosInstance } from "@/services/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  TariffRatesSearchParams,
  TariffRatesSearchResponse,
} from "./tariff.types";

export const useSearchTariffRates = (params: TariffRatesSearchParams) => {
  return useQuery<TariffRatesSearchResponse, AxiosError>({
    queryKey: ["tariff-rates", "search", params],
    queryFn: async () => {
      const response = await axiosInstance.post(
        `/v1/tariff-rates/search`,
        params,
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
};
