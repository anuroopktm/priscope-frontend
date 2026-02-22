import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { axiosInstance } from "../api/axiosInstance";
import type {
  GetPrivilegeTemplatesResponse,
  GetUsersRequest,
  GetUsersResponse,
  ResourcePrivilegesRequest,
  ResourcePrivilegesResponse,
} from "./user-management.types";

export const useGetUsers = (payload: GetUsersRequest) => {
  return useQuery<GetUsersResponse, AxiosError<{ detail: string }>>({
    queryKey: ["users", payload],
    queryFn: async () => {
      const { data } = await axiosInstance.post("/v1/users", payload);
      return data;
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetResourcePrivileges = (
  payload: ResourcePrivilegesRequest,
) => {
  return useQuery<ResourcePrivilegesResponse, AxiosError<{ detail: string }>>({
    queryKey: ["resource-privileges", payload],
    queryFn: async () => {
      const { data } = await axiosInstance.post(
        "/v1/resource-privileges",
        payload,
      );
      return data;
    },
    enabled: !!payload.role_id,
    refetchOnWindowFocus: false,
  });
};

export const useGetPrivilegeTemplates = (tenant_id: string) => {
  return useQuery<
    GetPrivilegeTemplatesResponse,
    AxiosError<{ detail: string }>
  >({
    queryKey: ["privilege-templates", tenant_id],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/v1/privilege-template", {
        params: { tenant_id },
      });
      return data;
    },
    enabled: !!tenant_id,
    refetchOnWindowFocus: false,
  });
};
