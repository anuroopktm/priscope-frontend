import { PRIVILEGE_ACTIONS, PRIVILEGE_MODULES } from "../constants/privileges.constants";

const routePermissionMap = [
    { pathContains: 'manage-user', key: PRIVILEGE_MODULES.USER_MANAGEMENT, action: PRIVILEGE_ACTIONS.VIEW },
    { pathContains: 'freight-rate-library', key: PRIVILEGE_MODULES.FREIGHT_RATE, action: PRIVILEGE_ACTIONS.VIEW },
    { pathContains: 'tariff-rate-library', key: PRIVILEGE_MODULES.TARIFF_RATE, action: PRIVILEGE_ACTIONS.VIEW },
    { pathContains: 'fx-rate-library', key: PRIVILEGE_MODULES.FX_RATE, action: PRIVILEGE_ACTIONS.VIEW }
];

export const checkPathPermissions = (pathname: string, privileges: any): boolean => {
    return routePermissionMap.every(({ pathContains, key, action }) => {
        if (pathname.includes(pathContains)) {
            return privileges?.[key]?.includes(action);
        }
        return true;
    });
};
