import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { axiosInstance } from "../../api/axiosInstance";
import type { UserLoginRequest, UserLoginResponse } from "./sign-in.types";

export const useUserLogin = () => {
  return useMutation<
    UserLoginResponse,
    AxiosError<{ detail: string }>,
    UserLoginRequest
  >({
    mutationFn: async (payload: UserLoginRequest) => {
      const { data } = await axiosInstance.post("/v1/user-login", payload);
      return data;
    },
  });
};
