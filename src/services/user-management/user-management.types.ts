export interface User {
  email: string;
  job_designation: string;
  name: string;
  status: "ACTIVE" | "SUSPENDED" | "INVITED";
}

export interface GetUsersRequest {
  page_size: number;
  search: string;
  skip: number;
  status: string;
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
  tenant_id: string;
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

export type CheckEmailResponse = string;
