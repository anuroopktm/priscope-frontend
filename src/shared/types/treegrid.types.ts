import { ItemMasterBulkUploadData } from "@/app/[lang]/(protected)/item-master/helpers/type";

export interface TreeGridApi {
  id?: string;
  Rows: Record<string, TreeGridRow>;
  GetCell: (row: TreeGridRow, col: string) => HTMLElement | null;
  GetLast: () => TreeGridRow | null;
  GetScrollTop: () => number;
  GetBodyHeight: () => number;
  GetRowTop: (row: TreeGridRow) => number;
  AddRow: (
    parent: any,
    next: any,
    show: number,
    id?: string,
  ) => TreeGridRow | null;
  SetValue: (row: TreeGridRow, col: string, value: any, update: number) => void;
  RefreshRow: (row: TreeGridRow) => void;
  Update: () => void;
  Dispose: () => void;
  ShowMenu: (row: TreeGridRow, col: string, menu: TreeGridMenuConfig) => void;
  RemoveCol: (column: string) => void;
  HideCol: (column: string) => void;
  ShowCol: (column: string) => void;
  Focus: (row: TreeGridRow, col: string | null) => void;
  GetFirst: () => TreeGridRow | null;
  GetNext: (row: TreeGridRow) => TreeGridRow | null;
  GetCols: () => string[];
  GetSelRows: () => TreeGridRow;
  DeleteRows: (row: TreeGridRow, arg: number) => void;
  ClearSelection: () => void;
  GetRowById: (id: string | undefined) => TreeGridRow;
  AddCol: (
    col: string,
    sec: number,
    pos: number,
    param: { Width: number; Type: string; CanSort: number },
    show: number,
    type: string,
    caption: string,
  ) => void;
  GetFilter: () => [string, string, number][];
  Source: any;
  ReloadBody: () => void;
  ChangeFilter: (
    cols: string | string[],
    values: string | string[],
    operators: string | string[] | number[],
    nofilter: boolean | number,
    noclear: boolean |number,
  ) => void;
}

export interface TreeGridInternalApi extends TreeGridApi {
  Source: {
    Data: {
      Data?: any;
      Url?: string;
    };
  };
  ReloadBody: () => void;
}

export interface TreeGridMenuItem {
  Name: string;
  OnClick?: () => void;
}

export interface TreeGridMenuConfig {
  Items: TreeGridMenuItem[];
}

export interface TreeGridRow {
  id?: string;
  [key: string]: any;
}

export interface TreeGridLayout {
  Cfg: Record<string, any>;
  Def?: Record<string, any>;
  Cols: Array<Record<string, any>>;
  Header?: Record<string, any>;
  Solid?: any[];
}

export interface TreeGridData {
  Body: any[][];
}

export interface TreeGridProps {
  gridId: string;
  layout: TreeGridLayout | null;
  data: TreeGridData | null;
  config?: Record<string, any>;
  height?: string | number;
  enableEditPopover?: boolean;
  enableInfiniteScroll?: boolean;
  onLoadMore?: () => void;
  scrollThreshold?: number;
  contextMenuItems?: TreeGridContextMenuItem[];
  enableContextMenu?: boolean;
  onEditConfirm: (
    row: TreeGridRow,
    col: string,
    value: any,
    oldValue: any,
    comment?: string | null,
  ) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  setFilter: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

export interface TreeGridState {
  showSavePopover: boolean;
  popoverPosition: { top: number; left: number };
  changedCell: {
    row: TreeGridRow;
    col: string;
    value: any;
    oldValue: any;
  } | null;
}

export interface TreeGridRef {
  getGridInstance: () => TreeGridApi | null;
  setLoading: (status: boolean) => void;
  isLoading: () => boolean;
  getDataFromTable: () => ItemMasterBulkUploadData[];
  deleteSeletectedRows: () => void;
  showColumn: (label: string) => void;
  hideColumn: (label: string) => void;
  addColumn: (col: string) => void;
  focusRow: (rowId: string) => void;
  focusCell: (rowId: string, colKey: string) => void;
}

export interface TreeGridContextMenuItem {
  name: string;
  onClick: (grid: TreeGridApi, row: TreeGridRow, col: string) => void;
  visible?: (row: TreeGridRow) => boolean;
}
