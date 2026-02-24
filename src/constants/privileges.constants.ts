export const PRIVILEGE_MODULES = {
    USER_MANAGEMENT: 'user_management',
    MARGIN: 'margin',
    BILLING: 'billing',
    PRIVILEGE: 'privilege',
    TARIFF_RATE: 'tariff_rate',
    FREIGHT_RATE: 'freight_rate',
    FX_RATE: "fx_rate",
    ITEM_MASTER: "item_master"
} as const;

export const PRIVILEGE_ACTIONS = {
    VIEW: 'view',
    CREATE: 'create',
    DELETE: 'delete',
    EDIT: 'edit',
    EXPORT: 'export',
    IMPORT: 'import',
    ASSIGN: 'assign',
    REVOKE: 'revoke',
    ENABLE_DISABLE: 'enable_disable'
} as const;