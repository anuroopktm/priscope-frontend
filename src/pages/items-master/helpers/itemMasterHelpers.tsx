import { COMMENT_TYPE } from "@/constants/comments.constants";
import {
  PRIVILEGE_ACTIONS,
  PRIVILEGE_MODULES,
} from "@/constants/privileges.constants";
import { hasPrivilege } from "@/utils/hasPrivilege";
import { v4 as uuidv4 } from "uuid";
import { itemMasterColumnToFieldMap } from "@/pages/items-master/constants/columnFieldMap";
import { HEADERS } from "@/pages/items-master/constants/headers";
import type {
  AttributeConfigurationData,
  SystemFieldObject,
} from "../../items-master-refactor/types/types";

interface SkippedItem {
  frontend_id: string;
  [key: string]: any;
}

export function hasItemMasterPrivileges(privileges: Record<string, string[]>) {
  const hasEditItemMasterPrivilege = hasPrivilege(
    privileges,
    PRIVILEGE_MODULES.ITEM_MASTER,
    PRIVILEGE_ACTIONS.EDIT,
  );

  const hasItemMasterEnableDisablePrivilege = hasPrivilege(
    privileges,
    PRIVILEGE_MODULES.ITEM_MASTER,
    PRIVILEGE_ACTIONS.ENABLE_DISABLE,
  );

  const hasAddItemMasterPrivilege = hasPrivilege(
    privileges,
    PRIVILEGE_MODULES.ITEM_MASTER,
    PRIVILEGE_ACTIONS.CREATE,
  );
  return {
    hasEditItemMasterPrivilege,
    hasItemMasterEnableDisablePrivilege,
    hasAddItemMasterPrivilege,
  };
}

export function getItemMasterBulkInsertPayload(
  headers: string[],
  data: (string | number | null)[][],
): { items: Record<string, any>[] } {
  const items = data
    .filter((row) => row.some((cell) => cell !== null && cell !== ""))
    .map((row) => {
      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        const apiKey = itemMasterColumnToFieldMap[header] || header;
        const value = row[index];

        if (value !== null && value !== "") {
          obj[apiKey] = value;
        }
      });
      obj["frontend_id"] = row[0];
      return obj;
    });

  return { items };
}

export function assignRowIds(
  data: (string | number | null)[][],
): (string | number | null)[][] {
  return data.map((row) => {
    const hasValue = row.some((cell) => cell !== null && cell !== "");
    if (hasValue) {
      const updatedRow = [...row];
      updatedRow[0] = uuidv4();
      return updatedRow;
    }
    return row;
  });
}

export function filterSkippedRows(
  data: (string | number | null)[][],
  skippedItems: SkippedItem[],
): (string | number | null)[][] {
  const skippedIds = new Set(skippedItems.map((item) => item.frontend_id));
  return data.filter((row) => skippedIds.has(row[0] as string));
}

export const createSystemFieldMapping = (
  systemFields: SystemFieldObject[],
): Record<string, string> => {
  return systemFields.reduce(
    (acc, field) => {
      acc[field.name] = "";
      return acc;
    },
    {} as Record<string, string>,
  );
};

export function getAttributeConfigFromAvailableHeaders(
  headers: string[],
): AttributeConfigurationData {
  const config: AttributeConfigurationData = {};

  headers.forEach((header) => {
    config[header] = {
      dataType: "Text",
      mandatory: false,
    };
  });

  return config;
}

export const createItemMasterCommentPayload = (
  type: string,
  col: string,
  comment: string,
) => {
  if (type === COMMENT_TYPE.CELL) {
    return {
      comments: [
        {
          comment_type: "field",
          item_field_key: col,
          comment,
        },
      ],
      source: "item_master",
    };
  }

  if (type === COMMENT_TYPE.ROW) {
    return {
      comments: [
        {
          comment_type: "row",
          comment,
        },
      ],
      source: "item_master",
    };
  }

  return null;
};

export const getHeaderIdByIndex = (index: number) => {
  const header = HEADERS.headers[index];
  return header ? header.id : null;
};

export const getHeaderIndexById = (id: string) => {
  return HEADERS.headers.findIndex(
    (header) => header.id.toLowerCase() === id.toLowerCase(),
  );
};
