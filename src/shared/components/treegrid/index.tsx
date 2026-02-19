import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import TableSavePopover from "../table-save-popover";
import {
  TreeGridApi,
  TreeGridProps,
  TreeGridRow,
  TreeGridState,
} from "@/shared/types/treegrid.types";

let gridLoadingMap: Record<string, boolean> = {};

/**
 * TreeGrid is loaded globally via GridE.js
 */
declare global {
  interface Window {
    Grids: {
      OnGetHtmlValue?: (grid: any, row: any, col: any, val: any) => any;
      OnValueChanged?: (
        grid: TreeGridApi,
        row: TreeGridRow,
        col: string,
        val: any,
        oldval: any,
        errors?: any,
      ) => void;
      OnRightClick?: (
        grid: TreeGridApi,
        row: TreeGridRow,
        col: string,
        val: any,
        oldval: any,
        errors?: any,
      ) => number;
    };
    TreeGrid: any;
    TGSetEvent: (eventName: string, gridId: string, handler: Function) => void;
    TGDelEvent: (eventName: string, gridId: string) => void;
  }
}

export interface TreeGridRef {
  getGridInstance: () => TreeGridApi | null;
  setLoading: (status: boolean) => void;
  isLoading: () => boolean;
}

const TreeGrid = forwardRef<TreeGridRef, TreeGridProps>((props, ref) => {
  const {
    gridId,
    layout,
    data,
    config,
    height = "100%",
    enableInfiniteScroll,
    onLoadMore,
    scrollThreshold = 200,
    enableEditPopover = true,
    enableContextMenu = false,
    onEditConfirm,
    setSelectedRows,
    setFilter,
  } = props;

  const containerIdRef = useRef(`TreeGrid_${gridId}`);
  const gridRef = useRef<TreeGridApi | null>(null);
  const loadingRef = useRef<boolean>(false);

  const [state, setState] = useState<TreeGridState>({
    showSavePopover: false,
    popoverPosition: { top: 0, left: 0 },
    changedCell: null,
  });
  const [comment, setComment] = useState("");
  const [commentAdded, setCommentAdded] = useState(false);

  const createGrid = () => {
    gridRef.current = window.TreeGrid(
      {
        Debug: 0,
        id: gridId,
        Layout: { Data: layout },
        Data: { Data: data },
        ...config,
      },
      containerIdRef.current,
    );
  };

  const disposeGrid = () => {
    if (gridRef.current) {
      gridRef.current.Dispose();
      gridRef.current = null;
    }
  };

  useEffect(() => {
    if (state.showSavePopover && gridRef.current) {
      gridRef.current.Focus(null, null);
    }
  }, [state.showSavePopover]);

  useEffect(() => {
    // API events – per grid (recommended)
    window.TGSetEvent("OnValueChanged", gridId, handleValueChanged);
    window.TGSetEvent("OnScroll", gridId, onScroll);
    window.TGSetEvent("OnSelected", gridId, handleSelected);
    window.TGSetEvent("OnFilter", gridId, handleFilterChange);

    // Mouse action – GLOBAL (required)
    window.Grids ??= {};
    window.Grids.OnRightClick = handleRightClick;

    createGrid();

    return () => {
      window.TGDelEvent("OnScroll", gridId);
      window.TGDelEvent("OnValueChanged", gridId);
      window.TGDelEvent("OnSelected", gridId);
      window.TGDelEvent("OnFilter", gridId);

      if (window.Grids?.OnRightClick === handleRightClick) {
        delete window.Grids.OnRightClick;
      }

      disposeGrid();
    };
  }, []);

  const handleSelected = (
    grid: TreeGridApi,
    row: TreeGridRow,
    deselect: TreeGridRow,
    Cols: string,
  ) => {
    const selectedRows = grid.GetSelRows();
    if (!selectedRows) return;
    const ids = selectedRows.map((r: TreeGridRow) => r.id);
    setSelectedRows(ids);
  };

  const deleteSeletectedRows = () => {
    if (!gridRef.current) return;
    const rows = gridRef.current.GetSelRows();
    gridRef.current.DeleteRows(rows, 1);
  };

  const onScroll = (grid: TreeGridApi, hpos: number, vpos: number): void => {
    if (!onLoadMore) return;
    if (gridLoadingMap[gridId]) return;
    const lastRow = grid.GetLast();
    if (!lastRow) return;

    const scrollTop = grid.GetScrollTop ? grid.GetScrollTop() : vpos;
    const bodyHeight = grid.GetBodyHeight ? grid.GetBodyHeight() : 530;
    const lastRowTop = grid.GetRowTop ? grid.GetRowTop(lastRow) : 0;

    if (scrollTop + bodyHeight >= lastRowTop - scrollThreshold) {
      gridLoadingMap[gridId] = true;
      onLoadMore();
    }
  };

  const handleFilterChange = (grid: TreeGridApi) => {
    const filters = grid.GetFilter();
    const data = filters.reduce(
      (acc, [key, value]) => {
        if (!acc[key]) acc[key] = [];
        if (typeof value === "string") {
          const valueArray = value.split(";").map((v) => v.trim());
          acc[key].push(...valueArray);
        } else if (typeof value === "number" || typeof value === "boolean") {
          acc[key].push(String(value));
        }
        return acc;
      },
      {} as Record<string, string[]>,
    );
    setFilter(data);
    return true;
  };

  const handleValueChanged = (
    grid: TreeGridApi,
    row: TreeGridRow,
    col: string,
    val: any,
    oldval: any,
  ): void => {
    const isFilterRow = row?.Def?.Name === "Filter";
    if (
      grid.id !== gridId ||
      oldval == val ||
      !enableEditPopover ||
      isFilterRow
    )
      return;

    const cellElement = grid.GetCell(row, col);
    if (!cellElement) return;

    const rect = cellElement.getBoundingClientRect();

    setState({
      showSavePopover: true,
      popoverPosition: {
        top: rect.bottom - 130 + window.scrollY,
        left: rect.left - 80 + window.scrollX,
      },
      changedCell: {
        row,
        col,
        value: val,
        oldValue: oldval,
      },
    });
  };

  const handleRightClick = (
    grid: TreeGridApi,
    row: TreeGridRow,
    col: string,
  ) => {
    if (!grid || grid.id !== gridId || !props.contextMenuItems?.length) {
      return 0;
    }

    const items = props.contextMenuItems
      .filter((item) => !item.visible || item.visible(row))
      .map((item) => ({
        Name: item.name,
        OnClick: () => item.onClick(grid, row, col),
      }));

    if (!items.length) return 0;

    grid.ShowMenu(row, col, { Items: items });
    return 1;
  };

  const addColumn = (columnName: string) => {
    if (!gridRef.current) return;

    const colCaption = columnName;
    const section = 1;
    const position = -1;
    const params = {
      Width: 150,
      Type: "Text",
      CanSort: 1,
      CanEdit: 1,
    };
    const show = 1;
    const type = "Text";

    gridRef.current.AddCol(
      columnName,
      section,
      position,
      params,
      show,
      type,
      colCaption,
    );
  };

  const hideColumn = (Column: string) => {
    if (!gridRef.current) return;
    gridRef.current.HideCol(Column);
  };

  const showColumn = (column: string) => {
    if (!gridRef.current) return;
    gridRef.current.ShowCol(column);
  };

  const deleteColumn = (Column: string) => {
    if (!gridRef.current) return;
    gridRef.current.RemoveCol(Column);
  };

  const focusRow = (rowId: string) => {
    const grid = gridRef.current;
    if (!grid) return;

    const row = grid.Rows[rowId];
    if (!row) return;

    setTimeout(() => {
      grid.Focus(row, null);
    }, 0);
  };

  const focusCell = (rowId: string, col: string) => {
    const grid = gridRef.current;
    if (!grid) return;

    const row = grid.Rows[rowId];
    if (!row) return;

    setTimeout(() => {
      grid.Focus(row, col);
    }, 0);
  };

  const getDataFromTable = () => {
    if (!gridRef.current) return [];
    const Grid = gridRef.current;
    const result = [];
    let row = Grid.GetFirst();
    while (row) {
      if (row.Kind === "Data") {
        const rowData: TreeGridRow = { id: row.id };
        Grid.GetCols().forEach((col: string) => {
          rowData[col] = row![col];
        });
        result.push(rowData);
      }
      row = Grid.GetNext(row);
    }
    return result;
  };

  const handleEditSave = () => {
    if (!state.changedCell) return;
    if (comment.trim().length === 0) {
      return;
    }
    const { row, col, value, oldValue } = state.changedCell;

    onEditConfirm?.(row, col, value, oldValue, comment);
    setState((prev) => ({
      ...prev,
      showSavePopover: false,
      changedCell: null,
    }));
    setCommentAdded(false);
  };

  const handleEditCancel = () => {
    if (!state.changedCell) return;
    const { row, col, value, oldValue } = state.changedCell;
    const Grid = gridRef.current;
    if (Grid) {
      const gridRow = Grid.GetRowById(row.id);
      if (gridRow) Grid.SetValue(gridRow, col, oldValue, 1);
    }
    setState((prev) => ({
      ...prev,
      showSavePopover: false,
      changedCell: null,
    }));
  };

  useImperativeHandle(ref, () => ({
    getGridInstance: () => gridRef.current,
    setLoading: (status: boolean) => {
      gridLoadingMap[gridId] = status;
    },
    isLoading: () => loadingRef.current,
    hideColumn,
    showColumn,
    addColumn,
    deleteColumn,
    focusRow,
    focusCell,
    getDataFromTable,
    deleteSeletectedRows,
  }));

  return (
    <>
      <div
        id={containerIdRef.current}
        style={{ width: "100%", height: "100%" }}
      />

      {state.showSavePopover && enableEditPopover && (
        <div
          style={{
            position: "absolute",
            top: state.popoverPosition.top,
            left: state.popoverPosition.left,
            zIndex: 1000,
          }}
        >
          <TableSavePopover
            onSave={() => {
              setCommentAdded(true);
              handleEditSave();
            }}
            onCancel={() => {
              setCommentAdded(false);
              handleEditCancel();
            }}
            setComment={setComment}
            comment={comment}
            commentAdded={commentAdded}
          />
        </div>
      )}
    </>
  );
});

TreeGrid.displayName = "TreeGrid";

export default TreeGrid;
