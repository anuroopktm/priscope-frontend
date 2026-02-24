import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { axiosInstance } from "../api/axiosInstance";
import type {
  AssignUserPrivilegesRequest,
  AssignUserPrivilegesResponse,
  BulkDeleteUsersRequest,
  BulkDeleteUsersResponse,
  BulkStatusUpdateRequest,
  BulkStatusUpdateResponse,
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
  ListUserDetailsRequest,
  ListUserDetailsResponse,
  ListUserPrivilegesRequest,
  ListUserPrivilegesResponse,
  ResourcePrivilegesRequest,
  ResourcePrivilegesResponse,
  UpdateUserRequest,
  UpdateUserResponse,
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
    queryKey: ["user-privileges", payload.user_id],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/v1/list-user-privileges", {
        params: payload,
      });
      return data;
    },
    enabled: !!payload.user_id,
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

export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();

  return useMutation<
    BulkDeleteUsersResponse,
    AxiosError<{ detail: string }>,
    BulkDeleteUsersRequest
  >({
    mutationFn: async (payload: BulkDeleteUsersRequest) => {
      const { data } = await axiosInstance.delete("/v1/users/bulk-delete", {
        data: payload,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
export const useBulkStatusUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation<
    BulkStatusUpdateResponse,
    AxiosError<{ detail: string }>,
    BulkStatusUpdateRequest
  >({
    mutationFn: async (payload: BulkStatusUpdateRequest) => {
      const { data } = await axiosInstance.put(
        "/v1/bulk-status-update",
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useListUserDetails = (payload: ListUserDetailsRequest) => {
  return useQuery<ListUserDetailsResponse, AxiosError<{ detail: string }>>({
    queryKey: ["user-details", payload.user_id],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/v1/list-user-details", {
        params: payload,
      });
      return data;
    },
    enabled: !!payload.user_id,
    refetchOnWindowFocus: false,
  });
};

export const useAssignUserPrivileges = () => {
  return useMutation<
    AssignUserPrivilegesResponse,
    AxiosError<{ detail: string }>,
    AssignUserPrivilegesRequest
  >({
    mutationFn: async (payload: AssignUserPrivilegesRequest) => {
      const { data } = await axiosInstance.post(
        "/v1/user/privileges/assign",
        payload,
      );
      return data;
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserResponse,
    AxiosError<{ detail: string }>,
    UpdateUserRequest
  >({
    mutationFn: async (payload: UpdateUserRequest) => {
      const { data } = await axiosInstance.patch("/v1/update-user", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-details"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
