import { useSession } from "next-auth/react";

export const useTenantId = () => {
  const TENANT_ID = "123e4567-e89b-12d3-a456-426614174000";
  const { data } = useSession();
  return data?.user.tenantId ? data.user.tenantId : TENANT_ID;
};
