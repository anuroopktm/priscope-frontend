export interface User {
  id: string;
  name: string;
  email: string;
  job_designation: string;
  status: "active" | "suspended" | "invited";
}

export interface GetUsersRequest {
  page_size: number;
  search?: string;
  skip: number;
  status?: string;
  tenant_id: string;
}

export interface GetUsersResponse {
  count: number;
  users: User[];
}

export interface ResourcePrivilege {
  description: string;
  display_name: string;
  resource_privilege_id: string;
}

export interface ResourcePrivilegesRequest {
  role_id?: string;
  tenant_id?: string;
}

export type ResourcePrivilegesResponse = ResourcePrivilege[];

export interface PrivilegeTemplate {
  role_id: string;
  role_name: string;
  tenant_id: string;
}

export type GetPrivilegeTemplatesResponse = PrivilegeTemplate[];

export interface CheckEmailRequest {
  email: string;
}

export type CheckEmailResponse = boolean;

export interface InviteUserRequest {
  email: string;
  job_designation: string;
  name: string;
  resource_privilege_ids: string[];
  tenant_id: string;
}

export interface InviteUserResponse {
  invite_url: string;
  status: string;
  user_id: string;
}

export interface ListUserPrivilegesRequest {
  user_id?: string;
}

export interface ListUserPrivilegesResponse {
  resource_privilege_ids: string[];
}

export interface CheckTemplateRequest {
  resource_privilege_ids: string[];
}

export interface CheckTemplateResponse {
  exists: boolean;
}

export interface CheckTemplateNameRequest {
  template_name: string;
}

export interface CheckTemplateNameResponse {
  exists: boolean;
}

export interface CreateRoleRequest {
  description: string;
  resource_privilege_id: string[];
  role_name: string;
  role_type: string;
}

export interface CreateRoleResponse {
  description: string;
  id: string;
  is_active: boolean;
  role_name: string;
  tenant_id: string;
  type: string;
}

export interface BulkDeleteUsersRequest {
  user_ids: string[];
}

export interface BulkDeleteUsersResponse {
  deleted_count: number;
  deleted_user_ids: string[];
  message: string;
  tenant_id: string;
}

export interface BulkStatusUpdateRequest {
  status: string;
  user_ids: string[];
}

export interface BulkStatusUpdateResponse {
  failed_count: number;
  message: string;
  tenant_id: string;
  total_count: number;
  updated_count: number;
  updated_user_ids: string[];
}

export interface ListUserDetailsRequest {
  user_id?: string;
}

export interface ListUserDetailsResponse {
  email: string;
  job_designation: string;
  name: string;
  tenant_user_status: string;
}

export interface AssignUserPrivilegesRequest {
  resource_privilege_ids: string[];
  tenant_id: string;
  user_id: string;
}

export interface AssignUserPrivilegesResponse {
  added_ids: string[];
  removed_ids: string[];
}

export interface UpdateUserRequest {
  job_designation: string;
  name: string;
  status: string;
  user_id: string;
}

export interface UpdateUserResponse {
  message: string;
}
