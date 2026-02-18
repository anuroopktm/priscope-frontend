import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../api/axiosInstance";
import type { AuthResponse, LoginPayload, User } from "./auth.types";

// Keys for caching
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

// --- API Functions ---

const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<AuthResponse>(
    "/auth/login",
    payload,
  );
  return data;
};

const fetchCurrentUser = async (): Promise<User> => {
  const { data } = await axiosInstance.get<User>("/auth/me");
  return data;
};

const logoutUser = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
};

// --- Hooks ---

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Save token
      localStorage.setItem("authToken", data.token);
      // Update user cache
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: fetchCurrentUser,
    retry: false, // Don't retry if 401
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem("authToken");
      queryClient.clear();
      // window.location.href = '/login';
    },
  });
};
