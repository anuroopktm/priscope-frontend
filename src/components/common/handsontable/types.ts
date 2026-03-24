export interface HandsontableProps {
  hotRef: any;
  headers: string[];
  data: (string | number)[][];
  readOnlyColumns?: string[];
  onLoadMore?: () => void;
  onConfirmRow?: (rowIndex: number, comment: string, hotRef: any) => void;
  onCancelRow?: (rowIndex: number) => void;
  failedRows?: Set<number>;
  loadingRows?: Set<number>;
  containerTypeOptions?: { id: string; label: string }[];
  currencyOptions?: { id: string; label: string; description?: string }[];
  addRowInprogress: boolean;
  setAddRowInprogress: any;
  relations?: [string, string][];
  handleConfirmEdit: (
    editingCell: any,
    data: string[],
    comment: string,
  ) => void;
  handleConfirmComment: (
    editingCell: any,
    data: string[],
    comment: string,
  ) => void;
  setSelectedRows: any;
  selectedRows: Record<number, boolean>;
  onRowClick?: (rowData: (string | number)[]) => void;
  setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
  commentMantatoryFields?: string[];
  highlightTarget: {
    freightRateId: string;
    fieldKey?: string | null;
  };
  columnFieldMap: Record<number, string>;
  //   onFreightRateIdNotFound?: (freightRateId: string) => void;
  onFreightRateIdNotFound?: (id: string) => Promise<boolean>;
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
  hasEditPermission: boolean;
  hasAddPermission: boolean;
  setHighlightTarget: any;
}

export type EditState = {
  top: number;
  left: number;
  row: number;
  col: number;
  oldValue: string;
} | null;

export enum ActiveOverlayType {
  EDIT = "edit",
  ROW_COMMENT = "rowComment",
  CELL_COMMENT = "cellComment",
}

export type ActiveOverlay = {
  type: ActiveOverlayType;
  row: number;
  col?: number; // optional for rowComment
  top: number;
  left: number;
  oldValue?: string; // for edit type
};
