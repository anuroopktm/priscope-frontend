export const ADMIN_REQUEST_ACTIONS = {
    INSERT: "insert",
    UPDATE: "update",
    BULK_STATUS_UPDATE: "bulk_status_change",
} as const;

export const ADMIN_REQUEST_MODULES = {
    FREIGHT_RATE: "freight_rate",
    TARIFF_RATE: "tariff_rate",
} as const;