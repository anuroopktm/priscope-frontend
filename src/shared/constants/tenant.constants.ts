export interface Tenant {
  id: string;
  name: string;
}

export const TENANTS: Tenant[] = [
  { id: "tenant-1", name: "Tenant 1" },
  { id: "tenant-2", name: "Tenant 2" },
  { id: "tenant-3", name: "Tenant 3" },
];
