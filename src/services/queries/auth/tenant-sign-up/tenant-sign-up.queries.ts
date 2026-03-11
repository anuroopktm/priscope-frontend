import { axiosInstance } from "@/services/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import type { TenantSignUpPayload } from "./tenant-sign-up.types";

export const useTenantSignUpQuery = () => {
  return useMutation({
    mutationFn: async (payload: TenantSignUpPayload) => {
      const response = await axiosInstance.post("/v1/tenant/signup", payload);
      return response.data;
    },
  });
};

export const useSendSignUpOtp = () => {
  return useMutation({
    mutationFn: async (data: { email: string; name: string }) => {
      const payload = {
        email: data.email,
        name: "signup",
      };
      const response = await axiosInstance.post(
        "/v1/tenant/send-signup-otp",
        payload,
      );
      return response.data;
    },
  });
};
