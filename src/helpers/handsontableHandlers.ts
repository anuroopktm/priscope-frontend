import {
  ActiveOverlayType,
  type ActiveOverlay,
} from "@/components/common/handsontable/types";

interface HandleAfterChangeParams {
  hotRef: React.RefObject<any>;
  addRowInprogress: boolean;
  headers: string[];
  colNameToIndex: Record<string, number>;
  highlightCell: (
    hot: any,
    row: number,
    col: number,
    isInvalid?: boolean,
  ) => void;
  relations: [string, string][];
  setHighlightedCells: (cells: [number, number][]) => void;
  activeOverlay: ActiveOverlay | null;
}
interface HighlightRelationParams {
  hot: any;
  row: number;
  changedColName: string;
  relations: [string, string][];
  colNameToIndex: Record<string, number>;
  headers: string[];
  highlightCell: (
    hot: any,
    row: number,
    col: number,
    isInvalid?: boolean,
  ) => void;
  setHighlightedCells: (cells: [number, number][]) => void;
}
function highlightRelatedCells({
  hot,
  row,
  changedColName,
  relations,
  colNameToIndex,
  highlightCell,
  setHighlightedCells,
}: HighlightRelationParams) {
  setHighlightedCells([]);
  relations.forEach(([fromCol, toCol]) => {
    const fromIndex = colNameToIndex[fromCol];
    const toIndex = colNameToIndex[toCol];
    if (fromIndex === null || toIndex === null) {
      return;
    }

    if (changedColName === fromCol) {
      setHighlightedCells([
        [row, fromIndex],
        [row, toIndex],
      ]);

      if (toIndex !== undefined) {
        highlightCell(hot, row, toIndex);
      }
    } else if (changedColName === toCol) {
      setHighlightedCells([
        [row, fromIndex],
        [row, toIndex],
      ]);

      if (fromIndex !== undefined) {
        highlightCell(hot, row, fromIndex);
      }
    }
  });
}

export function getHandleAfterChange({
  hotRef,
  addRowInprogress,
  headers,
  colNameToIndex,
  highlightCell,
  relations,
  setHighlightedCells,
  activeOverlay,
}: HandleAfterChangeParams) {
  return (changes: any, source: any) => {
    if (source === "edit" && changes) {
      const hot = hotRef.current?.hotInstance;
      if (!hot || addRowInprogress) return;
      hot.batchRender(() => {
        changes.forEach(
          ([row, prop, oldValue, newValue]: [
            number,
            number,
            string,
            string,
          ]) => {
            const colIndex =
              typeof prop === "number" ? prop : colNameToIndex[prop];
            const changedColName = headers[colIndex];

            if (
              (typeof newValue === "string" && newValue.trim() === "") ||
              (typeof newValue === "number" && newValue === 0)
            ) {
              highlightCell(hot, row, colIndex, true);
              return;
            }

            if (
              oldValue == newValue ||
              !activeOverlay ||
              activeOverlay.type !== ActiveOverlayType.EDIT
            )
              return;

            highlightRelatedCells({
              hot,
              row,
              changedColName,
              relations,
              colNameToIndex,
              headers,
              highlightCell,
              setHighlightedCells,
            });
          },
        );
      });
    }
  };
}

export function getHandleAfterBeginEditing({
  hotRef,
  addRowInprogress,
  hasEditPermission,
  activeOverlay,
  confirmationModalVisible,
  setConfirmationModalVisible,
  confirm,
  wrapperRef,
  setActiveOverlay,
  relations,
  colNameToIndex,
  headers,
  highlightCell,
  setHighlightedCells,
}: {
  hotRef: React.RefObject<any>;
  addRowInprogress: boolean;
  hasEditPermission: boolean;
  activeOverlay: ActiveOverlay | null;
  confirmationModalVisible: boolean;
  setConfirmationModalVisible: (visible: boolean) => void;
  confirm: (options: {
    header: string;
    message: string;
    confirmButtonText: string;
    cancelButtonText: string;
  }) => Promise<boolean>;
  wrapperRef: any;
  setActiveOverlay: React.Dispatch<React.SetStateAction<ActiveOverlay | null>>;
  relations?: [string, string][];
  colNameToIndex?: Record<string, number>;
  headers?: string[];
  highlightCell?: (
    hot: any,
    row: number,
    col: number,
    isInvalid?: boolean,
  ) => void;
  setHighlightedCells?: (cells: [number, number][]) => void;
}) {
  const beginEdit = (hot: any, row: number, col: number) => {
    const td = hot.getCell(row, col);
    if (td && wrapperRef.current) {
      const oldValue = hot.getDataAtCell(row, col);
      scheduleOverlayUpdate(td, row, col, oldValue, wrapperRef.current);
    }
    if (
      relations &&
      highlightCell &&
      setHighlightedCells &&
      colNameToIndex &&
      headers
    ) {
      const changedColName = headers[col];

      highlightRelatedCells({
        hot,
        row,
        changedColName,
        relations,
        colNameToIndex,
        headers,
        highlightCell,
        setHighlightedCells,
      });
    }
  };

  const scheduleOverlayUpdate = (
    td: HTMLElement,
    row: number,
    col: number,
    oldValue: string,
    wrapperRef: any,
  ) => {
    requestAnimationFrame(() => {
      const tdRect = td.getBoundingClientRect();
      const containerRect = wrapperRef?.getBoundingClientRect();

      let top = tdRect.top - containerRect.top + (tdRect.height + 2);
      const left = tdRect.left - containerRect.left - 150;

      // Adjust if overlay overflows bottom edge
      if (top + 120 > containerRect.height) {
        top = top - (135 + tdRect.height);
      }

      setActiveOverlay({
        type: ActiveOverlayType.EDIT,
        row,
        col,
        oldValue,
        top,
        left,
      });
    });
  };

  // The main handler returned to Handsontable
  return async (row: number, col: number) => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || addRowInprogress) return;

    if (
      !hasEditPermission &&
      (!activeOverlay || activeOverlay.type !== ActiveOverlayType.EDIT) &&
      !confirmationModalVisible
    ) {
      setConfirmationModalVisible(true);

      const result = await confirm({
        header: "Admin Approval Required!",
        message:
          "You don’t have permission to add a new rate, but you can suggest new rates for admin approval. They will take effect once approved.",
        confirmButtonText: "Understood",
        cancelButtonText: "Cancel",
      });

      if (result) {
        setConfirmationModalVisible(false);
        hot.selectCell(row, col);
        hot.getActiveEditor().beginEditing();
      } else {
        hot.deselectCell();
        setConfirmationModalVisible(false);
        return;
      }
    }

    beginEdit(hot, row, col);
  };
}

export function getHandleAfterGetColHeader({
  hotRef,
  selectAll,
  setSelectAll,
}: {
  hotRef: React.RefObject<any>;
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (col: number, TH: HTMLElement) => {
    const hot = hotRef.current?.hotInstance;
    const headerText = TH.querySelector(".header-text");

    // ✅ Handle checkbox column header (-1)
    if (col === -1) {
      const hot = hotRef.current?.hotInstance;
      TH.innerHTML = "";

      const wrapper = document.createElement("div");
      wrapper.className = "row-header-wrapper";
      Object.assign(wrapper.style, {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        position: "relative",
      });

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = selectAll;
      input.addEventListener("change", () => {
        setSelectAll((prev) => !prev);
        if (selectAll == true) {
          hot.deselectCell();
        }
      });

      wrapper.appendChild(input);
      TH.appendChild(wrapper);
    }

    // ✅ Handle sorting click on column header
    if (headerText && hot) {
      headerText.addEventListener("click", (e: Event) => {
        const clickedCol = Number(
          (e.currentTarget as HTMLElement).getAttribute("data-col"),
        );

        const sorting = hot.getPlugin("columnSorting");
        const currentSort = sorting.getSortConfig();

        const nextOrder =
          currentSort?.[0]?.column === clickedCol &&
          currentSort?.[0]?.sortOrder === "asc"
            ? "desc"
            : "asc";

        sorting.sort({ column: clickedCol, sortOrder: nextOrder });
      });
    }
  };
}

export function getAfterGetRowHeader({
  hotRef,
  selectAll,
  selectedRows,
  setSelectedRows,
  newRows,
  failedRows,
  IdIndex,
}: {
  hotRef: React.RefObject<any>;
  selectAll?: boolean;
  selectedRows: Record<string, boolean>;
  setSelectedRows: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  newRows?: Set<number>;
  failedRows?: Set<number>;
  IdIndex: number;
}) {
  return (row: number, th: HTMLElement) => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    th.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "row-header-wrapper";
    Object.assign(wrapper.style, {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      position: "relative",
    });

    // Assuming column 8 stores the ID
    const id = hot.getDataAtCell(row, IdIndex);

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = selectAll ? selectAll : !!selectedRows?.[id];
    input.addEventListener("change", () => {
      setSelectedRows((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    });

    wrapper.appendChild(input);
    th.appendChild(wrapper);

    // Apply CSS classes based on row state
    if (newRows) {
      th.parentElement?.classList.toggle("new-row", newRows?.has(row));
    }
    if (failedRows) {
      th.parentElement?.classList.toggle("failed-row", failedRows?.has(row));
    }
  };
}

export const handleGetCellMeta = (
  row: number,
  col: number,
  cellProperties: any,
  hotRef: any,
) => {
  const hot = hotRef.current?.hotInstance;
  if (!hot) return;

  const lastColIndex = hot.countCols() - 1;
  const lastColValue = hot.getDataAtCell(row, lastColIndex);

  if (lastColValue === "inactive") {
    cellProperties.readOnly = true;
    cellProperties.className = `${cellProperties.className ?? ""} inactive-cell`;
  }

  if (col === 6 || col === 7) {
    cellProperties.readOnly = true;
  }
};

export function getHandleContextMenuCallback({
  hotRef,
  wrapperRef,
  setActiveOverlay,
}: {
  hotRef: React.RefObject<any>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  setActiveOverlay: React.Dispatch<React.SetStateAction<ActiveOverlay | null>>;
}) {
  return (key: string, selection: any[]) => {
    if (!selection?.length) return;
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    const row = selection[0].start.row;
    const col = selection[0].start.col;
    const td = hot.getCell(row, col);
    if (!td || !wrapperRef.current) return;

    const tdRect = td.getBoundingClientRect();
    const containerRect = wrapperRef.current.getBoundingClientRect();
    let top = tdRect.top - containerRect.top + tdRect.height + 2;
    const left = tdRect.left - containerRect.left;

    if (top + 120 > containerRect.height) {
      top = top - (135 + tdRect.height);
    }

    if (key === "addRowComment") {
      setActiveOverlay({ type: ActiveOverlayType.ROW_COMMENT, row, top, left });
    } else if (key === "addCellComment") {
      setActiveOverlay({
        type: ActiveOverlayType.CELL_COMMENT,
        row,
        col,
        top,
        left,
      });
    }
  };
}

export function getHandleBeforeContextMenuSetItems({
  hotRef,
}: {
  hotRef: React.RefObject<any>;
}) {
  return (menuItems: any[]) => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    const selected = hot.getSelectedLast();
    if (!selected) return;

    const [selectedRow, selectedColumn] = selected;
    const columnSettings = hot.getSettings().columns;

    Object.values(menuItems).forEach((item: any) => {
      if (typeof item === "object") item.disabled = false;
    });

    if (
      (columnSettings[selectedColumn] &&
        "readOnly" in columnSettings[selectedColumn]) ||
      selectedRow === -1
    ) {
      menuItems.forEach((item: any) => {
        item.disabled = true;
      });
    }
  };
}
