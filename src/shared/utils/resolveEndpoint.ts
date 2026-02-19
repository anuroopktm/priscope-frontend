import { FREIGHT_RATE_ENDPOINTS } from "@/app/[lang]/(protected)/freight-rate-library/constants/api.endpoints";
import { FX_RATE_ENDPOINTS } from "@/app/[lang]/(protected)/fx-rate-library/constants/api.endpoints";
import { ITEM_MASTER_ENDPOINTS } from "@/app/[lang]/(protected)/item-master/constants/api.endpoints";
import { USER_ENDPOINTS } from "@/app/[lang]/(protected)/manage-user/constants/api.endpoints";
import { TARIFF_RATE_ENDPOINTS } from "@/app/[lang]/(protected)/tariff-rate-library/constants/api.endpoints";
import { AUTH_ENDPOINTS } from "@/app/[lang]/(unprotected)/auth/constants/api.endpoints";
import { COMMON_ENDPOINTS, EXPORT_RATE_ENDPOINTS } from "../constants/api.endpoints";

const ENDPOINT_GROUPS = {
    auth: AUTH_ENDPOINTS,
    user: USER_ENDPOINTS,
    itemMaster: ITEM_MASTER_ENDPOINTS,
    freightRate: FREIGHT_RATE_ENDPOINTS,
    tariffRate: TARIFF_RATE_ENDPOINTS,
    fxRate: FX_RATE_ENDPOINTS,
    exportRate: EXPORT_RATE_ENDPOINTS,
    common: COMMON_ENDPOINTS
};

export function resolveEndpoint(path: string): string | null {
  for (const group in ENDPOINT_GROUPS) {
    const endpoints = ENDPOINT_GROUPS[group as keyof typeof ENDPOINT_GROUPS];

    for (const key in endpoints) {
      const endpoint = endpoints[key as keyof typeof endpoints];

      if (typeof endpoint === "string") {
        if (endpoint === path) {
          return group;
        }
      } else if (typeof endpoint === "function") {
        const sample = endpoint(":param");
        const regex = new RegExp("^" + sample.replace(":param", "[^/]+") + "$");

        if (regex.test(path)) {
          return group;
        }
      }
    }
  }
  return null;
}
