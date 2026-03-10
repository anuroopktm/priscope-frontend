import { v4 as uuidv4 } from "uuid";
import { baseGridCfg } from "../constants/grid-cfg";
import { allowedKeys, Field_Map } from "../constants/itemmaster.constants";
import {
  type itemMasterBodyResponseItems,
  //   type itemMasterBodyResponseItemsField,
  type ItemMasterBulkUploadData,
  type ItemMasterBulkUploadFormattedDataItem,
  type ItemMasterBulkUploadFormattedDataPayload,
  type itemMasterHeaderResponse,
  type itemMasterHeaderResponseArrayList,
  type itemMasterRequestModalItems,
  type ItemMasterRequestModalResponse,
  type TreeGridBody,
  type TreeGridHeader,
  type TreeGridHeaderList,
  type TreeGridRow,
} from "./types";

export const buildItemMasterTreeGridCols = (
  items: itemMasterHeaderResponseArrayList[] | undefined,
): TreeGridHeaderList => {
  if (!items || items.length === 0) {
    return { cols: [] };
  }
  const cols: TreeGridHeader[] = items
    .filter((item) => item.label !== "Color")
    .map((item) => {
      const col: any = {
        Name: item.name,
        Type: "Text",
        RelWidth: 0,
        CanEdit: 1,
        CanFilter: 1,
        Visible: 1,
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
      filterRow[`${item.name}Type`] = "Enum";
      filterRow[`${item.name}Enum`] = "|" + values.join("|");
      filterRow[`${item.name}FilterOff`] = "(All)";
      filterRow[`${item.name}Range`] = 1;
    }
  });
  return filterRow;
};

export async function getItemMasterLayout(
  Cols: TreeGridHeader[],
  headers: itemMasterHeaderResponse | undefined,
) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const filterHead = buildTreeGridFilterHead(headers?.headers);

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
      ...headers?.headers.reduce(
        (acc, header) => {
          acc[header.name] = header.label;
          acc[`${header.name}Color`] = "#FFF";
          // acc[`${header.name}Background`] = "#00c3ff";
          acc[`${header.name}Align`] = "Center";
          acc[`${header.name}Button`] = "Defaults";
          return acc;
        },
        {} as Record<string, string>,
      ),
    },
    Actions: {
      OnClickSide:
        "try { var fRow = Grid.GetRowById ? Grid.GetRowById('Filter') : Grid.GetRow('Filter'); if(fRow) { if(fRow.Visible) Grid.HideRow(fRow); else Grid.ShowRow(fRow); return -1; } } catch(e) { return -1; }",
    },
    Head: [filterHead],
    Solid: [],
  };
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

export const getDataBulkUploadFormat = (
  items: ItemMasterBulkUploadData[] | undefined,
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

export const getDataBulkUploadFormatAdminApproval = (
  newData: ItemMasterBulkUploadData[] | undefined,
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

type AllowedKey = (typeof allowedKeys)[number];
export const recordItemMasterModal = (
  items: itemMasterRequestModalItems[] | undefined,
): ItemMasterRequestModalResponse[] => {
  if (!items || items.length === 0) return [];
  const recordList = items.map((item) => {
    const recordObject: ItemMasterRequestModalResponse = {};
    (Object.keys(item) as AllowedKey[]).forEach((key) => {
      if (allowedKeys.includes(key)) {
        recordObject[key] = item[key];
      }
    });
    return recordObject;
  });
  return recordList;
};

export const convertSavedFilter = (filter: Record<string, string[]>) => {
  const cols: string[] = [];
  const values: string[] = [];
  const operators: number[] = [];
  Object.entries(filter).forEach(([key, val]) => {
    cols.push(key);
    values.push(val.join(";"));
    operators.push(1);
  });
  return { cols, values, operators };
};
