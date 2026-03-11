import { axiosInstance } from "@/services/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useLogout = () => {
  return useMutation<void, AxiosError<{ detail: string }>>({
    mutationFn: async () => {
      const { data } = await axiosInstance.post("/v1/logout");
      return data;
    },
    onSuccess: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("tenant_id");
      localStorage.removeItem("user_id");
      localStorage.removeItem("privileges");
    },
  });
};
