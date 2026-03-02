import { COMMENT_TYPE } from "@/constants/comments.constants";
import {
  DEfAULT_VISIBLE_COLUMNS,
  Field_Map,
} from "../constants/headers.constants";
import { baseGridCfg } from "../tree-grid/config/layout";
import type {
  itemMasterBodyResponseItems,
  ItemMasterBulkUploadFormattedDataItem,
  ItemMasterBulkUploadFormattedDataPayload,
  itemMasterHeaderResponse,
  itemMasterHeaderResponseArrayList,
  TreeGridBody,
  TreeGridHeader,
  TreeGridHeaderList,
  TreeGridRow,
} from "./types";
import { itemMasterColumnToFieldMap } from "@/pages/items-master/constants/columnFieldMap";
import {
  PRIVILEGE_ACTIONS,
  PRIVILEGE_MODULES,
} from "@/constants/privileges.constants";
import { hasPrivilege } from "@/utils/hasPrivilege";
import { v4 as uuidv4 } from "uuid";

export const buildTreeGridFilterHead = (
  items: itemMasterHeaderResponseArrayList[] | undefined,
) => {
  const filterRow: any = {
    id: "Filter",
    Kind: "Filter",
    Height: 22,
  };
  items?.forEach((item) => {
    if (item.filter_type === "dropdown" && item.distinct_values?.length) {
      const values = item.distinct_values.filter((v) => v && v.trim() !== "");
      filterRow[`${item.label}Type`] = "Enum";
      filterRow[`${item.label}Enum`] = "|" + values.join("|");
      filterRow[`${item.label}FilterOff`] = "(All)";
      filterRow[`${item.label}Range`] = 1;
    }
  });
  return filterRow;
};

export const ItemMasterGridLayout = (
  Cols: TreeGridHeader[],
  headers: itemMasterHeaderResponse | undefined,
) => {
  const filterHead = buildTreeGridFilterHead(headers?.headers);
  console.log(filterHead, "filterheaddd");

  return {
    Cfg: {
      ...baseGridCfg,
    },
    Def: {
      R: {
        CanEdit: "1",
      },
      Filter: {
        CanEdit: "1",
      },
    },
    Cols: Cols,
    Header: {
      SKU: "SKU",
      UPC: "UPC",
      Category: "Category",
      Description: "Description",
      SortIcons: "2",
      SKUButton: "Defaults",
      UPCButton: "Defaults",
      CategoryButton: "Defaults",
      DescriptionsButton: "Defaults",
      QuantityButton: "Defaults",
      FilterBtn: "Filter",
      FilterBtnButton: "Filter",
    },
    Actions: {
      OnClickSide:
        "try { var fRow = Grid.GetRowById ? Grid.GetRowById('Filter') : Grid.GetRow('Filter'); if(fRow) { if(fRow.Visible) Grid.HideRow(fRow); else Grid.ShowRow(fRow); return -1; } } catch(e) { return -1; }",
    },
    Head: [filterHead],
    Solid: [],
  };
};

export const buildItemMasterTreeGridCols = (
  items: itemMasterHeaderResponseArrayList[] | undefined,
): TreeGridHeaderList => {
  if (!items || items.length === 0) {
    return { cols: [] };
  }
  console.log(items, "===================.");
  const cols: TreeGridHeader[] = items
    .filter((item) => item.label !== "Color")
    .map((item) => {
      const col: any = {
        Name: item.label,
        Type: "Text",
        RelWidth: 1,
        CanEdit: 1,
        CanFilter: 1,
        Visible: DEfAULT_VISIBLE_COLUMNS.includes(item.label) ? 1 : 0,
      };
      return col;
    });
  return { cols };
};

export const buildItemMasterTreeGridBody = (
  items: itemMasterBodyResponseItems[] | undefined,
): TreeGridBody => {
  if (!items || items.length === 0) {
    return { Body: [[]] };
  }
  const body: TreeGridRow[] = items.map((item) => {
    const row: TreeGridRow = { id: item.id };

    (Object.keys(item) as (keyof itemMasterBodyResponseItems)[]).forEach(
      (key) => {
        const value = item[key];
        if (
          key !== "attributes" &&
          key !== "suppliers" &&
          key !== "customers" &&
          key !== "id"
        ) {
          if (value && typeof value === "object" && "value" in value) {
            row[value.label as string] = value.value;
          } else if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
          ) {
            row[key] = value;
          }
        } else if (key === "attributes") {
          const attrs = item.attributes;
          if (attrs) {
            Object.values(attrs).forEach((attr) => {
              if (attr.label?.toLowerCase() === "color") return;
              if (attr.label && attr.value !== undefined) {
                row[attr.label] = attr.value;
              }
            });
          }
        } else if (key === "suppliers") {
          const supplier = item.suppliers?.[0];
          if (!supplier) return;

          row["Supplier Name"] = supplier.name;
          row["Supplier Code"] = supplier.code;

          if (supplier.cost) {
            Object.entries(supplier.cost).forEach(([costKey, costValue]) => {
              row[costKey] = costValue;
            });
          }
        } else if (key === "customers") {
          const customer = item.customers?.[0];
          if (!customer) return;

          row["Customer Name"] = customer.name;
          row["Customer Code"] = customer.code;

          if (customer.cost) {
            Object.entries(customer.cost).forEach(([costKey, costValue]) => {
              row[costKey] = costValue;
            });
          }
        }
      },
    );

    return row;
  });
  return { Body: [body] };
};

export const getEditCellValueAdminApproval = (
  newData: itemMasterBodyResponseItems | undefined,
  oldData: itemMasterBodyResponseItems | undefined,
  comment: any,
) => {
  if (!newData || !oldData) return;
  return {
    source_module: "item_master",
    target_module: "item_master",
    request_action: "update",
    request_info: [
      {
        old_record: {
          data: oldData,
        },
        new_record: {
          data: newData,
          comment,
        },
      },
    ],
    request_comments: "update",
  };
};

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

export const getEmptyRowData = (
  cols: TreeGridHeader[],
  rowCount = 25,
): TreeGridBody => {
  const rows: TreeGridRow[] = Array.from({ length: rowCount }, (_, i) => {
    const row: TreeGridRow = {
      id: `Row${i}`,
    };
    cols.forEach((col) => {
      if (col.Name !== "id") {
        row[col.Name] = "";
      }
    });
    return row;
  });
  return {
    Body: [rows],
  };
};
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

export const getDataBulkUploadFormatAdminApproval = (
  newData: TreeGridRow[] | undefined,
  comment: string,
) => {
  const items = newData
    ?.filter((item) =>
      Object.entries(item).some(([key, value]) => {
        if (key === "id" || key === "_DefaultSort") return false;
        return value !== undefined && value !== "" && value !== null;
      }),
    )
    .map((item) => {
      const id = uuidv4();
      return {
        frontend_id: id,
        sku: String(item?.SKU),
        upc: String(item?.UPC),
        category: item?.Category,
        hs_code: item?.["HS Code"],
        description: item?.Description,
        source_type: "manual",
        attribute: {},
        source: "item_master",
        action_key: "sku",
        comments: comment
          ? [
              {
                comment_type: "field",
                field_key: "upc",
                comment: comment,
              },
            ]
          : [],
      };
    });
  return {
    source_module: "item_master",
    target_module: "item_master",
    request_action: "insert",
    request_info: [
      {
        new_record: {
          items,
        },
      },
    ],
    request_comments: "insert",
  };
};

export const bulkOrderSkippedRecordFormat = (
  items: ItemMasterBulkUploadFormattedDataItem[] | undefined,
  finalCols: TreeGridHeader[],
): TreeGridBody => {
  if (!items?.length) return { Body: [] };
  const rows: TreeGridRow[] = items?.map((item) => {
    const row: TreeGridRow = {
      id: item?.frontend_id!,
      __skipped: true,
    };
    finalCols.forEach((col) => {
      const key = Field_Map[col.Name];
      if (key && item[key as keyof typeof item] !== undefined) {
        row[col.Name] = item[key as keyof typeof item];
      } else {
        row[col.Name] = "";
      }
    });
    return row;
  });
  return {
    Body: [rows],
  };
};

export const getDataBulkUploadFormat = (
  items: TreeGridRow[] | undefined,
): ItemMasterBulkUploadFormattedDataPayload => {
  const formatteditems =
    items
      ?.filter((item) =>
        Object.entries(item).some(([key, value]) => {
          if (key === "id" || key === "_DefaultSort") return false;
          return value !== "" && value !== null && value !== undefined;
        }),
      )
      .map((item) => {
        const id = uuidv4();
        return {
          frontend_id: id,
          sku: String(item?.SKU),
          upc: String(item?.UPC),
          category: item?.Category,
          hs_code: item?.["HS Code"],
          description: item?.Description,
          source_type: "manual",
          attribute: {},
          temp_sku: false,
          source: "item_master",
        };
      }) ?? [];
  return { items: formatteditems };
};
