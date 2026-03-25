import CityAutocompleteEditor from "@/utils/cityAutoCompleteEditor";
import ContainerTypeEditor from "@/utils/ContainerTypeEditor";
import { dateValidationRenderer } from "@/utils/dateValidationRenderer";
import { HoverableTextRenderer } from "@/utils/hoverableTextRenderer";
import { validationRules } from "@/utils/validationRules";

interface CurrencyOption {
  label: string;
}

interface getColumnHeaderParams {
  headers: string[];
  readOnlyColumns: string[];
  selectedRows: Record<number, boolean>;
  failedRows: Set<number>;
  newRows: Set<number>;
  containerTypeOptions: ContainerType[];
  currencyOptions: CurrencyOption[];
  createContainerType: any;
  setShowLoader: (val: boolean) => void;
  wrapperRef: any;
  addRowInprogress: boolean;
  hasFailedRow: boolean;
}

interface ContainerType {
  id: string;
  label: string;
}

interface GetColumnHeadersRendererParams {
  headers: string[];
  columnFilters: any;
  getColumnValues: (col: number) => any[];
}

export function getColumnHeaders({
  headers,
  readOnlyColumns,
  selectedRows,
  failedRows,
  newRows,
  containerTypeOptions,
  currencyOptions,
  createContainerType,
  setShowLoader,
  wrapperRef,
  addRowInprogress = false,
  hasFailedRow = false,
}: getColumnHeaderParams) {
  return headers.map((header, colIndex) => {
    const columnConfig: any = {};

    if (readOnlyColumns.includes(header)) {
      columnConfig.readOnly = true;
    }

    if (colIndex === 0 || colIndex === 1) {
      columnConfig.type = "text";
      columnConfig.editor = CityAutocompleteEditor;
      columnConfig.placeOptions = { mode: "city" };
      columnConfig.renderer = HoverableTextRenderer;
    }

    if (colIndex === 2) {
      columnConfig.type = "dropdown";
      columnConfig.editor = ContainerTypeEditor;
      columnConfig.source = containerTypeOptions.map((c) => c.label);
      columnConfig.strict = true;
      columnConfig.allowInvalid = false;
      columnConfig.placeholder = "Select";
      columnConfig.onCreateContainerType = async ({
        type,
      }: {
        type: string;
      }) => {
        try {
          setShowLoader(true);
          const res = await createContainerType.mutateAsync({ type });
          containerTypeOptions.push({ id: res.id, label: res.type });
          setShowLoader(false);
          return res;
        } catch (err) {
          console.error("Failed to create container type:", err);
          throw err;
        }
      };
    } else if (colIndex === 3) {
      columnConfig.type = "dropdown";
      columnConfig.source = currencyOptions.map((c) => c.label);
      columnConfig.strict = true;
      columnConfig.allowInvalid = false;
      columnConfig.placeholder = "Select";
    } else if (colIndex === 5) {
      columnConfig.type = "date";
      columnConfig.dateFormat = "YYYY-MM-DD";
      columnConfig.correctFormat = true;
      columnConfig.allowInvalid = false;
      columnConfig.placeholder = "Select";
      columnConfig.renderer = dateValidationRenderer(
        addRowInprogress && hasFailedRow,
      );
      columnConfig.datePickerConfig = {
        reposition: true,
        onOpen: function () {
          requestAnimationFrame(() => {
            const picker = this.el;
            const rect = picker.getBoundingClientRect();
            const containerRect = wrapperRef.current!.getBoundingClientRect();

            if (rect.bottom > containerRect.bottom) {
              const top = rect.height + 40;
              picker.style.top = `-${top}px`;
            }
          });
        },
      };
    }

    columnConfig.cells = (row: number) => {
      const cellProperties: any = {};
      if (selectedRows[row]) {
        cellProperties.className = "selected";
      } else if (failedRows.has(row)) {
        cellProperties.className = "new-row failed-row";
      } else if (newRows.has(row)) {
        cellProperties.className = "new-row";
      }
      if (newRows.has(row) || failedRows.has(row)) {
        cellProperties.readOnly = false;
      }
      return cellProperties;
    };

    return columnConfig;
  });
}

export function getColumnHeadersRenderer({
  headers,
  columnFilters,
  getColumnValues,
}: GetColumnHeadersRendererParams) {
  return (col: number) => {
    if (col === -1) {
      return '<input type="checkbox" class="select-all-checkbox" />';
    }

    const isFiltered =
      columnFilters[col] &&
      columnFilters[col].size > 0 &&
      columnFilters[col].size < getColumnValues(col).length;

    return `
        <div class="header-wrapper" data-col="${col}">
          <span class="header-text" data-col="${col}">${headers[col]}</span>
          <button 
            class="filter-btn" 
            data-col="${col}" 
            ${isFiltered ? 'style="color: #1976d2;"' : ""}
          >▼</button>
        </div>
      `;
  };
}

export function getUpdateOverlayPosition({
  hotRef,
  wrapperRef,
  headers,
  newRows,
  failedRows,
  loadingRows,
  setOverlayPositions,
}: {
  hotRef: React.RefObject<any>;
  wrapperRef: React.RefObject<any>;
  headers: string[];
  newRows: Set<number>;
  failedRows: Set<number>;
  loadingRows: Set<number>;
  setOverlayPositions: React.Dispatch<
    React.SetStateAction<Record<number, { top: number; left: number }>>
  >;
}) {
  return (rowIndex: number) => {
    const hot = hotRef.current?.hotInstance;
    const wrapperEl = wrapperRef.current;
    if (
      !hot ||
      !wrapperEl ||
      (!newRows.has(rowIndex) &&
        !failedRows.has(rowIndex) &&
        !loadingRows.has(rowIndex))
    )
      return;

    const wrapperRect = wrapperEl.getBoundingClientRect();

    // Subtract 3 because the last two columns (`id` and `status`) are hidden
    const lastCol = headers.length - 3;
    const cell = hot.getCell(rowIndex, lastCol);
    if (!cell) return;

    const cellRect = cell.getBoundingClientRect();
    const overlayW = 80;
    const overlayH = 40;

    let left = cellRect.right - wrapperRect.left - overlayW - 229;
    let top = cellRect.bottom - wrapperRect.top;

    // ✅ Keep inside wrapper bounds
    const maxLeft = wrapperRect.width - overlayW + 5;
    if (left > maxLeft) left = maxLeft;
    if (left < 6) left = 6;
    top = Math.max(4, Math.min(top, wrapperRect.height - overlayH - 4));

    // ✅ Update state
    setOverlayPositions((prev) => ({
      ...prev,
      [rowIndex]: { top, left },
    }));
  };
}

export function highlightCell(
  hot: any,
  row: number,
  col: number,
  error = false,
) {
  if (!hot || row === undefined || col === undefined) {
    return;
  }
  if (error) {
    hot.setCellMeta(row, col, "className", "hot-error-border");
  } else {
    hot.setCellMeta(row, col, "className", "hot-normal-border");
  }
  hot.render();
}

export function getDataAtRow(rowIndex: number, hotRef: React.RefObject<any>) {
  let rowValues = [];
  const hot = hotRef.current?.hotInstance;
  if (hot) {
    rowValues = hot.getDataAtRow(rowIndex);
  }
  return rowValues;
}

export const onConfirmEdit = (
  editState: any,
  handleConfirmEdit: (editState: any, data: any, comment: string) => void,
  commentRef: any,
  hotRef: any,
  removeEditOverlay: () => void,
) => {
  const data = getDataAtRow(editState?.row, hotRef);
  handleConfirmEdit(editState, data, commentRef.current || "");
  removeEditOverlay();

  const hotInstance = hotRef.current?.hotInstance;
  if (hotInstance) {
    hotInstance.deselectCell();
  }
};
export const onConfirmComment = (
  editState: any,
  handleConfirmComment: (editState: any, data: any, comment: string) => void,
  commentRef: any,
  hotRef: any,
  removeRowCommentOverlay: () => void,
) => {
  const data = getDataAtRow(editState?.row, hotRef);
  handleConfirmComment(editState, data, commentRef.current || "");
  removeRowCommentOverlay();

  const hotInstance = hotRef.current?.hotInstance;
  if (hotInstance) {
    hotInstance.deselectCell();
  }
};

export const onCancelEdit = (
  editState: any,
  hotRef: any,
  removeEditOverlay: () => void,
) => {
  const hotInstance = hotRef.current?.hotInstance;
  const { row, col, oldValue } = editState;
  if (hotInstance) {
    hotInstance.setDataAtCell(row, col, oldValue);
    hotInstance.deselectCell();
  }
  removeEditOverlay();
};

export const onConfirmAddRow = (
  idx: number,
  setNewRows: React.Dispatch<React.SetStateAction<Set<number>>>,
  commentRef: any,
  onConfirmRow?: (idx: number, comment: string, hotRef: any) => void,
  hotRef?: any,
  setAddRowInprogress?: React.Dispatch<React.SetStateAction<boolean>>,
  removeEditOverlay?: () => void,
) => {
  setNewRows((prev) => {
    const newSet = new Set(prev);
    newSet.delete(idx);
    return newSet;
  });

  const comment = commentRef.current || "";
  onConfirmRow?.(idx, comment, hotRef!);

  setAddRowInprogress?.(false);
  removeEditOverlay?.();
};

export const onCancelAddRow = (
  idx: number,
  setNewRows: React.Dispatch<React.SetStateAction<Set<number>>>,
  onCancelRow?: (idx: number) => void,
  hotRef?: any,
  setAddRowInprogress?: React.Dispatch<React.SetStateAction<boolean>>,
  removeEditOverlay?: () => void,
) => {
  setNewRows((prev) => {
    const newSet = new Set(prev);
    newSet.delete(idx);
    return newSet;
  });

  onCancelRow?.(idx);

  const hotInstance = hotRef?.current?.hotInstance;
  if (hotInstance) {
    hotInstance.deselectCell();
  }

  setAddRowInprogress?.(false);
  removeEditOverlay?.();
};

export const validateCellValue = (
  hot: any,
  headers: string[],
  row: number,
  col: number,
  value: string,
): boolean => {
  const colName = headers[col];
  const rules = validationRules[colName];
  if (!rules) return true;

  const passedRules: string[] = [];
  const failedRules: string[] = [];

  for (const rule of rules) {
    if (rule.test(value)) passedRules.push(rule.description);
    else failedRules.push(rule.description);
  }

  const isValid = failedRules.length === 0;

  const tooltipText = [
    ...passedRules.map((r) => `✅ ${r}`),
    ...failedRules.map((r) => `❌ ${r}`),
  ].join("\n");

  hot.setCellMeta(row, col, "className", isValid ? "" : "cell-error");
  hot.setCellMeta(row, col, "valid", isValid);
  hot.setCellMeta(row, col, "comment", { value: tooltipText });
  hot.render();

  return isValid;
};

export const resetHandsontableScroll = (hotRef: any) => {
  const hot = hotRef.current?.hotInstance;
  if (hot) {
    hot.scrollViewportTo(0, 0);
  }
};
