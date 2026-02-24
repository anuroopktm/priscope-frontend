import {
  FREIGHT_FIELDS,
  ITEM_MASTER_FIELDS,
  TARIFF_FIELDS,
} from "../constants/request-fields.constants";

export const recordTransformers: Record<
  string,
  (record: any) => Record<string, any>
> = {
  tariff_rate: (record) => {
    if (!record) return {};
    const normalized: any = {};
    TARIFF_FIELDS.forEach((field) => {
      if (record[field] !== undefined) {
        normalized[field] =
          field === "valid_to" ? record[field]?.split("T")[0] : record[field];
      }
    });
    return normalized;
  },

  freight_rate: (record) => {
    if (!record) return {};
    const normalized: any = {};
    FREIGHT_FIELDS.forEach((field) => {
      if (record[field] !== undefined) {
        normalized[field] =
          field === "valid_to" ? record[field]?.split("T")[0] : record[field];
      }
    });
    return normalized;
  },

  item_master: (record) => {
    if (!record) return {};
    const normalized: any = {};
    ITEM_MASTER_FIELDS.forEach((field) => {
      const fieldData = record.data[field];
      if (fieldData !== undefined) {
        normalized[field] = fieldData?.value ?? fieldData;
      }
    });
    return normalized;
  },

  // fallback if module not handled
  default: (record) => record || {},
};
