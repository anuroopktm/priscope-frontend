import { axiosInstance } from "@/services/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  SearchCustomersRequest,
  SearchCustomersResponse,
} from "./customers.types";

export const useSearchCustomers = (payload: SearchCustomersRequest) => {
  return useQuery<
    SearchCustomersResponse,
    AxiosError<{ detail: string | string[] }>
  >({
    queryKey: ["customers", payload],
    queryFn: async () => {
      const { data } = await axiosInstance.post<SearchCustomersResponse>(
        "/v1/customers/search",
        payload,
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });
};
