import type { TreeGridLayout } from "@/pages/items-master/helpers/types";
import {
  ITEM_MASTER_DRAWER_GRID_CFG,
  ITEM_MASTER_DRAWER_PANEL_CFG,
} from "../config/layout";
import { ITEM_MASTER_GRID_ID } from "../constants/grid.constants";

export const enrichItemMasterLayout = (
  layoutData: TreeGridLayout,
): TreeGridLayout => {
  return {
    ...layoutData,
    Cfg: {
      ...layoutData.Cfg,
      ...ITEM_MASTER_DRAWER_GRID_CFG,
      CfgId: ITEM_MASTER_GRID_ID,
    },
    Panel: ITEM_MASTER_DRAWER_PANEL_CFG,
  };
};
