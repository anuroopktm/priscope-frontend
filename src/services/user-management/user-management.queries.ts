import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { axiosInstance } from "../api/axiosInstance";
import type {
  CheckEmailRequest,
  CheckEmailResponse,
  CheckTemplateNameRequest,
  CheckTemplateNameResponse,
  CheckTemplateRequest,
  CheckTemplateResponse,
  CreateRoleRequest,
  CreateRoleResponse,
  GetPrivilegeTemplatesResponse,
  GetUsersRequest,
  GetUsersResponse,
  InviteUserRequest,
  InviteUserResponse,
  ListUserPrivilegesRequest,
  ListUserPrivilegesResponse,
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
    queryKey: ["resource-privileges", payload.role_id, payload.tenant_id],
    queryFn: async () => {
      const { data } = await axiosInstance.post(
        "/v1/resource-privileges",
        payload,
      );
      return data;
    },
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

export const useCheckEmailExist = () => {
  return useMutation<
    CheckEmailResponse,
    AxiosError<{ detail: string }>,
    CheckEmailRequest
  >({
    mutationFn: async (payload: CheckEmailRequest) => {
      const { data } = await axiosInstance.post("/v1/email-exist", payload);
      return data;
    },
  });
};

export const useInviteUser = () => {
  return useMutation<
    InviteUserResponse,
    AxiosError<{ detail: string }>,
    InviteUserRequest
  >({
    mutationFn: async (payload: InviteUserRequest) => {
      const { data } = await axiosInstance.post("/v1/invite", payload);
      return data;
    },
  });
};

export const useListUserPrivileges = (payload: ListUserPrivilegesRequest) => {
  return useQuery<ListUserPrivilegesResponse, AxiosError<{ detail: string }>>({
    queryKey: ["user-privileges", payload.tenant_id, payload.user_id],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/v1/list-user-privileges", {
        params: payload,
      });
      return data;
    },
    enabled: !!payload.tenant_id && !!payload.user_id,
    refetchOnWindowFocus: false,
  });
};

export const useCheckPrivilegeTemplate = () => {
  return useMutation<
    CheckTemplateResponse,
    AxiosError<{ detail: string }>,
    CheckTemplateRequest
  >({
    mutationFn: async (payload: CheckTemplateRequest) => {
      const { data } = await axiosInstance.post("/v1/templates/check", payload);
      return data;
    },
  });
};

export const useCheckTemplateName = () => {
  return useMutation<
    CheckTemplateNameResponse,
    AxiosError<{ detail: string }>,
    CheckTemplateNameRequest
  >({
    mutationFn: async (payload: CheckTemplateNameRequest) => {
      const { data } = await axiosInstance.post("/v1/template-name", payload);
      return data;
    },
  });
};

export const useCreateRole = () => {
  return useMutation<
    CreateRoleResponse,
    AxiosError<{ detail: string }>,
    CreateRoleRequest
  >({
    mutationFn: async (payload: CreateRoleRequest) => {
      const { data } = await axiosInstance.post("/v1/roles-creation", payload);
      return data;
    },
  });
};
