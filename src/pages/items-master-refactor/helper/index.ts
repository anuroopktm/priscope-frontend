import { DEfAULT_VISIBLE_COLUMNS } from "../constants/headers.constants";
import { baseGridCfg } from "../tree-grid/config/layout";
import type {
  itemMasterBodyResponseItems,
  itemMasterHeaderResponse,
  itemMasterHeaderResponseArrayList,
  TreeGridBody,
  TreeGridHeader,
  TreeGridHeaderList,
  TreeGridRow,
} from "./types";

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
