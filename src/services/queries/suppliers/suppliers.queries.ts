import { axiosInstance } from "@/services/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  SearchSuppliersRequest,
  SearchSuppliersResponse,
} from "./suppliers.types";

export const useSearchSuppliers = (payload: SearchSuppliersRequest) => {
  return useQuery<
    SearchSuppliersResponse,
    AxiosError<{ detail: string | string[] }>
  >({
    queryKey: ["search-suppliers", payload],
    queryFn: async () => {
      // Endpoint typically mirrors the route layout provided inside Axios base URLs setups.
      const { data } = await axiosInstance.post<SearchSuppliersResponse>(
        "/api/v1/suppliers/search",
        payload,
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });
};
