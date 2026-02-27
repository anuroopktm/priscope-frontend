import { baseGridCfg } from "../tree-grid/config/layout";
import type {
  itemMasterHeaderResponse,
  itemMasterHeaderResponseArrayList,
  TreeGridHeader,
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
