import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { axiosInstance } from "@/services/api/axiosInstance";

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
        `/approval-requests/search`,
        payload,
      );
      return response.data;
    },
  });
};
