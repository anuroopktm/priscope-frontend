import { axiosInstance } from "@/services/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  SendOtpRequest,
  SendOtpResponse,
  UserSignUpRequest,
  UserSignUpResponse,
  VerifyInviteRequest,
  VerifyInviteResponse,
  VerifyUserRequest,
  VerifyUserResponse,
} from "./sign-up.types";

export const useVerifyInvite = () => {
  return useMutation<
    VerifyInviteResponse,
    AxiosError<{ detail: string }>,
    VerifyInviteRequest
  >({
    mutationKey: ["verify-invite"],
    mutationFn: async (payload: VerifyInviteRequest) => {
      const { data } = await axiosInstance.post("/v1/verify-invite", payload);
      return data;
    },
  });
};

export const useVerifyUser = () => {
  return useMutation<
    VerifyUserResponse,
    AxiosError<{ detail: string }>,
    VerifyUserRequest
  >({
    mutationKey: ["verify-user"],
    mutationFn: async (payload: VerifyUserRequest) => {
      const { data } = await axiosInstance.post("/v1/verify-user", payload);
      return data;
    },
  });
};

export const useSendOtp = () => {
  return useMutation<
    SendOtpResponse,
    AxiosError<{ detail: string }>,
    SendOtpRequest
  >({
    mutationKey: ["send-otp"],
    mutationFn: async (payload: SendOtpRequest) => {
      const { data } = await axiosInstance.post("/v1/send-otp", payload);
      return data;
    },
  });
};

export const useUserSignUp = () => {
  return useMutation<
    UserSignUpResponse,
    AxiosError<{ detail: string }>,
    UserSignUpRequest
  >({
    mutationKey: ["user-signup"],
    mutationFn: async (payload: UserSignUpRequest) => {
      const { data } = await axiosInstance.post("/v1/user/signup", payload);
      return data;
    },
  });
};
