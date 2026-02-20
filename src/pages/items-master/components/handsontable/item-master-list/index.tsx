"use client";
import "@/shared/components/handsontable/HandsontableCustom.scss";
import RowOverlay from "@/shared/components/handsontable/row-overlay";
import LoaderOverlay from "@/shared/components/loader";
import { getAfterGetRowHeader, getHandleAfterBeginEditing, getHandleAfterChange, getHandleAfterGetColHeader, getHandleBeforeContextMenuSetItems, getHandleContextMenuCallback, handleGetCellMeta } from "@/shared/helpers/handsontableHandlers";
import { getDataAtRow, highlightCell, validateCellValue } from "@/shared/helpers/handsontableHelpers";
import { useConfirm } from "@/shared/providers/ModalProvider";
import { ActiveOverlay, ActiveOverlayType } from "@/shared/types/custom-handsontable";
import { arrayPreviewRenderer } from "@/shared/utils/arrayRenderer";
import { HoverableTextRenderer } from "@/shared/utils/hoverableTextRenderer";
import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import { registerAllModules } from "handsontable/registry";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getHeaderIndexById } from "../../../helpers/itemMasterHelpers";

registerAllModules();

interface ItemMasterListTableProps {
  headers: string[];
  data: string[][];
  onFirstColumnClick: () => void;
  setSelectedRows: any;
  selectedRows: Record<number, boolean>;
  newRows?: Set<number>;
  failedRows?: Set<number>;
  addRowInProgress?: boolean;
  onConfirmEdit: (
    editingCell: ActiveOverlay,
    rowData: string[],
    comment: string
  ) => void;
  handleConfirmComment: (
    editingCell: ActiveOverlay,
    rowData: string[],
    comment: string
  ) => void;
  commentMandatoryFields?: string[];
  hasEditPermission?: boolean;
  readOnlyColumns?: string[];
  relations: [string, string][];
  hiddenColumnIndices?: number[]
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  setSelectAll: any,
  selectAll: boolean;
  highlightTarget: {
    itemId: string | null;
    fieldKey?: string | null;
  };
}

const ItemMasterListTable: React.FC<ItemMasterListTableProps> = ({
  headers,
  data,
  onFirstColumnClick,
  setSelectedRows,
  selectedRows,
  onConfirmEdit,
  commentMandatoryFields = [],
  hasEditPermission = true,
  readOnlyColumns = [],
  addRowInProgress = false,
  relations,
  handleConfirmComment,
  hiddenColumnIndices,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  setSelectAll,
  selectAll,
  highlightTarget
}) => {
  const hotRef = useRef<any>(null);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [highlightedCells, setHighlightedCells] = useState<[number, number][]>([]);
  const confirm = useConfirm();
  const [isReady, setIsReady] = useState(false);
  const [retryKey, setRetryKey] = useState(0)

  const afterInit = () => {
    setIsReady(true);
  };

  const afterGetRowHeader = useCallback(
    getAfterGetRowHeader({
      selectAll,
      hotRef,
      selectedRows,
      setSelectedRows,
      IdIndex: 0
    }),
    [hotRef, selectedRows, setSelectedRows, isReady, selectAll]
  );

  useEffect(() => {
    const handler = (e: any) => {
      const { row, col, value } = e.detail;

      if (col === 0) {
        onFirstColumnClick();
      }
    };

    window.addEventListener("cellTextClick", handler);
    return () => window.removeEventListener("cellTextClick", handler);
  }, []);

  const columns = useMemo(
    () =>
      headers.map((header, colIndex) => {
        const columnConfig: any = {};

        // Custom renderers for array columns
        if (header === "Supplier" || header === "Customer") {
          columnConfig.renderer = arrayPreviewRenderer;
        }

        // hyperlink first column
        if (colIndex === 0) {
          columnConfig.renderer = HoverableTextRenderer;
        }

        return columnConfig;
      }),
    [headers]
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const commentRef = useRef<string>("");

  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay | null>(null);
  const [isCommentMandatory, setIsCommentMandatory] = useState(false);

  const colNameToIndex = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    headers.forEach((colName, index) => {
      map[colName] = index;
    });
    return map;
  }, [headers]);


  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || !highlightTarget.itemId) return;

    const tryHighlight = () => {
      const rowIndex = hot
        .getSourceData()
        .findIndex((row: any[]) => row[0] === highlightTarget.itemId);

      if (rowIndex === -1) {
        // Call parent callback if ID not found
        // onFreightRateIdNotFound?.(highlightTarget.freightRateId).then(
        //   () => {
        //     setRetryKey((prev) => prev + 1);
        //   }
        // );
        return;
      }

      if (!highlightTarget.fieldKey) {
        hot.selectCell(rowIndex, 0, rowIndex, hot.countCols() - 1, true);
      } else {
        // const colIndex = Number(
        //   Object.keys(columnFieldMap).find(
        //     (col) => columnFieldMap[+col] === highlightTarget.fieldKey
        //   )
        // );

        const colIndex = getHeaderIndexById(highlightTarget.fieldKey);

        if (!isNaN(colIndex)) {
          hot.selectCell(rowIndex, colIndex, rowIndex, colIndex, true);
        }
      }
      hot.render();
    };

    // Delay highlight until after data update + re-render
    setTimeout(tryHighlight, 50);
  }, [highlightTarget, retryKey]);


  const removeEditOverlay = useCallback(() => {
    setActiveOverlay(null);
    setHighlightedCells([]);
  }, []);


  const handleAfterBeginEditing = useCallback(
    getHandleAfterBeginEditing({
      hotRef,
      addRowInprogress: addRowInProgress,
      hasEditPermission,
      activeOverlay,
      confirmationModalVisible,
      setConfirmationModalVisible,
      confirm,
      wrapperRef,
      setActiveOverlay,
      colNameToIndex,
      headers,
      highlightCell,
      relations,
      setHighlightedCells
    }),
    [
      hotRef,
      addRowInProgress,
      hasEditPermission,
      activeOverlay,
      confirmationModalVisible,
      confirm,
      wrapperRef,
      setActiveOverlay,
      colNameToIndex,
      relations,
      setHighlightedCells,
      headers
    ]
  );

const handleAfterChange = useCallback(
    (changes: any, source: any) => {
      if (!changes || source === "loadData" || source === "validation-failed") return;

      const hot = hotRef.current?.hotInstance;
      if (!hot) return;

      for (const [row, prop, oldValue, newValue] of changes) {
        const colIndex = typeof prop === "number" ? prop : headers.indexOf(prop);
        if (colIndex === -1) continue;

        const valid = validateCellValue(hot, headers, row, colIndex, newValue);

        if (!valid) {
          hot.setDataAtCell(row, colIndex, oldValue, "validation-failed");
        }
      }

      getHandleAfterChange({
        hotRef,
        addRowInprogress: addRowInProgress,
        headers,
        colNameToIndex,
        highlightCell,
        relations,
        setHighlightedCells,
        activeOverlay,
      });
    },
    [hotRef, headers, colNameToIndex, highlightCell, relations, setHighlightedCells, activeOverlay]
  );

  const handleAfterScrollVertically = useCallback(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || !hasNextPage || isFetchingNextPage) return;

    const holder = hot.view._wt.wtTable.holder;
    const scrollTop = holder.scrollTop;
    const scrollHeight = holder.scrollHeight;
    const clientHeight = holder.clientHeight;

    const isBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (isBottom) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    if (highlightedCells?.length && hot) {
      hot.suspendRender();
      highlightCell(hot, highlightedCells[0][0], highlightedCells[0][1])
      highlightCell(hot, highlightedCells[1][0], highlightedCells[1][1])
      hot.resumeRender();
    }
  }, [highlightedCells])

  const handleAfterGetColHeader = useCallback(
    getHandleAfterGetColHeader({
      hotRef,
      selectAll,
      setSelectAll,
    }),
    [hotRef, selectAll, setSelectAll]
  );

  return (
    <div style={{ position: "relative" }} ref={wrapperRef}>
      <HotTable
        ref={hotRef}
        data={data}
        colHeaders={headers}
        rowHeaders={true}
        columns={columns}
        licenseKey="non-commercial-and-evaluation"
        className="custom-hot ht-theme-horizon"
        width="100%"
        stretchH="all"
        afterGetRowHeader={afterGetRowHeader}
        afterBeginEditing={handleAfterBeginEditing}
        afterChange={handleAfterChange}
        afterGetCellMeta={(row, col, cellProperties) => {
          handleGetCellMeta(row, col, cellProperties, hotRef)
          if (highlightedCells?.length && activeOverlay?.type === ActiveOverlayType.EDIT) {
            const isHighlighted = highlightedCells.some(([r, c]) => r === row && c === col);
            if (isHighlighted) {
              cellProperties.className = `${cellProperties.className || ''} highlighted-cell`;
            }
          }
        }}
        contextMenu={{
          callback: getHandleContextMenuCallback({ hotRef, wrapperRef, setActiveOverlay }),
          items: {
            addCellComment: { name: "Comment on this cell" },
            addRowComment: { name: "Comment on this row" },
            separator: Handsontable.plugins.ContextMenu.SEPARATOR,
          },
        }}
        beforeContextMenuSetItems={getHandleBeforeContextMenuSetItems({ hotRef })}
        afterScrollVertically={handleAfterScrollVertically}
        fillHandle={false}
        autoColumnSize={false}
        manualColumnResize={true}
        manualRowResize={true}
        manualColumnMove={true}
        columnSorting={{
          indicator: false
        }}
        afterInit={afterInit}
        hiddenColumns={{ columns: [0, ...hiddenColumnIndices ?? []] }}
        comments={true}
        afterGetColHeader={handleAfterGetColHeader}
      />
      {/* Edit Overlay */}
      {activeOverlay && (
        <RowOverlay
          key={1}
          rowIndex={activeOverlay.row}
          position={{ top: activeOverlay.top, left: activeOverlay.left }}
          onConfirm={() => {
            const data = getDataAtRow(activeOverlay.row, hotRef);

            if (activeOverlay.type === ActiveOverlayType.EDIT) {
              const value = data[activeOverlay.col!];
              if (!value) return;
              onConfirmEdit(activeOverlay, data, commentRef.current);
            } else if (activeOverlay.type === ActiveOverlayType.ROW_COMMENT || activeOverlay.type === ActiveOverlayType.CELL_COMMENT) {
              handleConfirmComment(
                activeOverlay,
                data,
                commentRef.current
              );
            }

            setActiveOverlay(null);
            const hotInstance = hotRef.current?.hotInstance;
            if (hotInstance) {
              hotInstance.deselectCell();
            }
          }}
          onCancel={() => {
            if (activeOverlay.type === ActiveOverlayType.EDIT) {
              const hotInstance = hotRef.current?.hotInstance;
              const { row, col, oldValue } = activeOverlay;
              if (hotInstance && oldValue !== undefined) {
                hotInstance.setDataAtCell(row, col!, oldValue);
              }
            }
            setActiveOverlay(null);
            const hotInstance = hotRef.current?.hotInstance;
            if (hotInstance) {
              hotInstance.deselectCell();
            }
          }}
          isLoading={false}
          showComment={true}
          commentRef={commentRef}
          isCommentRequired={isCommentMandatory}
        />
      )}
    </div>
  );
};

export default ItemMasterListTable;