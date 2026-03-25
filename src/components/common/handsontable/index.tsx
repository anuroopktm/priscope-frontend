"use client";
import {
  getAfterGetRowHeader,
  getHandleAfterBeginEditing,
  getHandleAfterChange,
  getHandleAfterGetColHeader,
  getHandleBeforeContextMenuSetItems,
  getHandleContextMenuCallback,
  handleGetCellMeta,
} from "@/helpers/handsontableHandlers";
import {
  type ActiveOverlay,
  ActiveOverlayType,
  type HandsontableProps,
} from "./types";
import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import { registerAllModules } from "handsontable/registry";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getColumnHeaders,
  getColumnHeadersRenderer,
  getDataAtRow,
  getUpdateOverlayPosition,
  highlightCell,
  onCancelAddRow,
  onConfirmAddRow,
  onConfirmComment,
  onConfirmEdit,
} from "@/helpers/handsontableHelpers";
import { FilterDropdown } from "./filter-dropdown";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-horizon.css";
import "./HandsontableCustom.scss";
import RowOverlay from "./row-overlay";
import { useCreateContainerType } from "@/pages/freight-rate-library/services/freightRateService";
import { useConfirm } from "@/pages/items-master-refactor/utils/ModalProvider";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";

registerAllModules();

const CustomHandsontable: React.FC<HandsontableProps> = ({
  hotRef,
  headers,
  data,
  readOnlyColumns = [],
  onLoadMore,
  onConfirmRow,
  onCancelRow,
  failedRows = new Set(),
  loadingRows = new Set(),
  containerTypeOptions = [],
  currencyOptions = [],
  addRowInprogress,
  setAddRowInprogress,
  relations = [],
  handleConfirmEdit,
  selectedRows,
  setSelectedRows,
  onRowClick,
  setShowLoader,
  commentMantatoryFields = [],
  highlightTarget,
  setHighlightTarget,
  columnFieldMap,
  onFreightRateIdNotFound,
  selectAll,
  setSelectAll,
  hasEditPermission,
  hasAddPermission,
  handleConfirmComment,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const commentRef = useRef<string>("");

  const [newRows, setNewRows] = useState<Set<number>>(new Set());
  const [columnFilters, setColumnFilters] = useState<
    Record<number, Set<string | number>>
  >({});
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });
  const [filteredData, setFilteredData] = useState(data);
  const [overlayPositions, setOverlayPositions] = useState<
    Record<number, { top: number; left: number }>
  >({});
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay | null>(
    null,
  );
  const [highlightedCells, setHighlightedCells] = useState<[number, number][]>(
    [],
  );
  const [isCommentMandatory, setIsCommentMandatory] = useState(true);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const createContainerType = useCreateContainerType();
  const confirm = useConfirm();

  const colNameToIndex = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    headers.forEach((colName, index) => {
      map[colName] = index;
    });
    return map;
  }, [headers]);

  const getColumnValues = useCallback(
    (columnIndex: number): (string | number)[] => {
      const values = data.map((row) => row[columnIndex]);
      return [...new Set(values)].sort();
    },
    [data],
  );

  const columns = useMemo(
    () =>
      getColumnHeaders({
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
        addRowInprogress,
        hasFailedRow: failedRows.size > 0,
      }),
    [
      headers,
      readOnlyColumns,
      selectedRows,
      failedRows,
      newRows,
      containerTypeOptions,
      currencyOptions,
      createContainerType,
      setShowLoader,
    ],
  );

  const colHeaders = useCallback(
    getColumnHeadersRenderer({
      headers,
      columnFilters,
      getColumnValues,
    }),
    [columnFilters, getColumnValues, headers],
  );

  const handleAfterChange = useCallback(
    getHandleAfterChange({
      hotRef,
      addRowInprogress,
      headers,
      colNameToIndex,
      highlightCell,
      relations,
      setHighlightedCells,
      activeOverlay,
    }),
    [
      hotRef,
      addRowInprogress,
      headers,
      colNameToIndex,
      highlightCell,
      relations,
      setHighlightedCells,
      activeOverlay,
    ],
  );

  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || !highlightTarget.freightRateId) return;

    const tryHighlight = () => {
      const rowIndex = hot
        .getSourceData()
        .findIndex((row: any[]) => row[8] === highlightTarget.freightRateId);

      if (rowIndex === -1) {
        // Call parent callback if ID not found
        onFreightRateIdNotFound?.(highlightTarget.freightRateId!).then(
          (res: boolean) => {
            if (res) {
              setRetryKey((prev) => prev + 1);
            }
          },
        );
        return;
      }

      if (!highlightTarget.fieldKey) {
        hot.selectCell(rowIndex, 0, rowIndex, hot.countCols() - 1, true);
        setHighlightTarget({ freightRateId: null, fieldKey: null });
      } else {
        const colIndex = Number(
          Object.keys(columnFieldMap).find(
            (col) => columnFieldMap[+col] === highlightTarget.fieldKey,
          ),
        );

        if (!isNaN(colIndex)) {
          hot.selectCell(rowIndex, colIndex, rowIndex, colIndex, true);
          setHighlightTarget({ freightRateId: null, fieldKey: null });
        }
      }
      hot.render();
    };

    // Delay highlight until after data update + re-render
    setTimeout(tryHighlight, 300);
  }, [highlightTarget, columnFieldMap, onFreightRateIdNotFound, retryKey]);

  const handleAfterBeginEditing = useCallback(
    getHandleAfterBeginEditing({
      hotRef,
      addRowInprogress,
      hasEditPermission,
      activeOverlay,
      confirmationModalVisible,
      setConfirmationModalVisible,
      confirm,
      wrapperRef,
      setActiveOverlay,
    }),
    [
      hotRef,
      addRowInprogress,
      hasEditPermission,
      activeOverlay,
      confirmationModalVisible,
      confirm,
      wrapperRef,
      setActiveOverlay,
    ],
  );

  useEffect(() => {
    loadGoogleMaps();
  }, []);

  const prevDataLengthRef = useRef(data.length);

  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    hot.suspendRender();
    let filtered = data;

    Object.entries(columnFilters).forEach(([colIndex, selectedValues]) => {
      const columnIndex = parseInt(colIndex);
      if (selectedValues.size > 0) {
        filtered = filtered.filter((row) =>
          selectedValues.has(row[columnIndex]),
        );
      }
    });

    setFilteredData(filtered);

    // Detect if a new row was added
    if (data.length > prevDataLengthRef.current && addRowInprogress) {
      setNewRows((prev) => new Set([0, ...prev]));
    }
    prevDataLengthRef.current = data.length;

    if (hotRef.current?.hotInstance) {
      hotRef.current.hotInstance.loadData(filtered);
    }

    hot.resumeRender();
  }, [columnFilters, data, headers.length]);

  const updateOverlayPosition = useCallback(
    getUpdateOverlayPosition({
      hotRef,
      wrapperRef,
      headers,
      newRows,
      failedRows,
      loadingRows,
      setOverlayPositions,
    }),
    [
      hotRef,
      wrapperRef,
      headers,
      newRows,
      failedRows,
      loadingRows,
      setOverlayPositions,
    ],
  );

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    if (!wrapperEl) return;

    const observer = new ResizeObserver(() => {
      const rowsToUpdate = new Set([...newRows, ...failedRows, ...loadingRows]);
      rowsToUpdate.forEach((rowIndex) => updateOverlayPosition(rowIndex));
    });

    observer.observe(wrapperEl);

    return () => observer.disconnect();
  }, [newRows, failedRows, loadingRows, data]);

  // Handle filter button clicks
  const handleFilterIconClick = (columnIndex: number, event: MouseEvent) => {
    event.stopPropagation();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setFilterPosition({
      top: rect.bottom + window.scrollY - 125,
      left: rect.left + window.scrollX - 7,
    });
    if (activeFilter === columnIndex) {
      setActiveFilter(null);
    } else {
      setActiveFilter(columnIndex);
    }
  };

  const handleFilterChange = (
    columnIndex: number,
    selectedValues: Set<string | number>,
  ) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnIndex]: selectedValues,
    }));
  };

  // Set up filter button event listeners
  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("filter-btn")) {
        const colIndex = parseInt(target.dataset.col || "0", 10);
        handleFilterIconClick(colIndex, e);
      }
    };

    hot?.rootElement?.addEventListener("click", handleClick);
    return () => {
      hot?.rootElement?.removeEventListener("click", handleClick);
    };
  }, [activeFilter]);

  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    if (activeOverlay?.type === ActiveOverlayType.EDIT) {
      const { row, col } = activeOverlay;
      if (col == null) return;
      const colHeader = headers[col];
      const field = commentMantatoryFields.find((value) => value === colHeader);
      const required = !hasEditPermission ? true : !!field;
      setIsCommentMandatory(required);
      highlightCell(hot, row, col);
    }
  }, [activeOverlay, headers, commentMantatoryFields]);

  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    if (addRowInprogress) {
      hot.scrollViewportTo(0, 0);
    }
  }, [addRowInprogress]);

  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    setSelectedRows({});
    if (hot) {
      hot.deselectCell();
    }
  }, [filteredData]);

  useEffect(() => {
    const handler = (e: any) => {
      const { row, col } = e.detail;

      if (newRows.has(row) || failedRows.has(row)) return;
      if (col === 0 || col === 1) {
        const rowData = getDataAtRow(row, hotRef);
        onRowClick?.(rowData);
      }
    };

    window.addEventListener("cellTextClick", handler);
    return () => window.removeEventListener("cellTextClick", handler);
  }, []);

  const afterGetRowHeader = useCallback(
    getAfterGetRowHeader({
      hotRef,
      selectAll,
      selectedRows,
      setSelectedRows,
      newRows,
      failedRows,
      IdIndex: 8,
    }),
    [hotRef, selectAll, selectedRows, setSelectedRows, newRows, failedRows],
  );

  const handleAfterScrollVertically = () => {
    if (activeOverlay?.type == ActiveOverlayType.EDIT) {
      removeEditOverlay();
    }
    const hotInstance = hotRef.current?.hotInstance;
    if (!hotInstance || hotInstance.isDestroyed || !onLoadMore) return;

    const holder = hotInstance.view._wt.wtTable.holder;
    const scrollTop = holder.scrollTop;
    const scrollHeight = holder.scrollHeight;
    const clientHeight = holder.clientHeight;

    const isBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (isBottom) {
      onLoadMore();
    }
  };

  const removeEditOverlay = () => {
    if (activeOverlay?.type === ActiveOverlayType.EDIT) {
      setActiveOverlay(null);
      setHighlightedCells([]);
    }
  };

  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    if (highlightedCells?.length && hot) {
      hot.suspendRender();
      highlightCell(hot, highlightedCells[0][0], highlightedCells[0][1]);
      highlightCell(hot, highlightedCells[1][0], highlightedCells[1][1]);
      hot.resumeRender();
    }
  }, [highlightedCells]);

  const handleAfterGetColHeader = useCallback(
    getHandleAfterGetColHeader({
      hotRef,
      selectAll,
      setSelectAll,
    }),
    [hotRef, selectAll, setSelectAll],
  );

  return (
    <div className="relative-wrapper" ref={wrapperRef}>
      {addRowInprogress && <div className="overlay" />}
      <HotTable
        ref={hotRef}
        data={filteredData}
        colHeaders={colHeaders}
        rowHeaders={true}
        licenseKey="non-commercial-and-evaluation"
        afterChange={handleAfterChange}
        afterGetRowHeader={afterGetRowHeader}
        afterScrollVertically={handleAfterScrollVertically}
        columns={columns}
        className="custom-hot ht-theme-horizon"
        width="100%"
        stretchH="all"
        afterGetCellMeta={(row, col, cellProperties) =>
          handleGetCellMeta(row, col, cellProperties, hotRef)
        }
        afterGetColHeader={handleAfterGetColHeader}
        columnSorting={{
          indicator: false,
        }}
        fillHandle={false}
        hiddenColumns={{
          columns: [8, 9],
          indicators: false,
        }}
        afterBeginEditing={handleAfterBeginEditing}
        viewportRowRenderingOffset={20}
        autoColumnSize={false}
        contextMenu={{
          callback: getHandleContextMenuCallback({
            hotRef,
            wrapperRef,
            setActiveOverlay,
          }),
          items: {
            addCellComment: { name: "Comment on this cell" },
            addRowComment: { name: "Comment on this row" },
            separator: Handsontable.plugins.ContextMenu.SEPARATOR,
          },
        }}
        beforeContextMenuSetItems={getHandleBeforeContextMenuSetItems({
          hotRef,
        })}
      />
      <FilterDropdown
        isOpen={activeFilter !== null}
        onClose={() => setActiveFilter(null)}
        position={filterPosition}
        columnValues={
          activeFilter !== null ? getColumnValues(activeFilter) : []
        }
        selectedValues={
          activeFilter !== null
            ? columnFilters[activeFilter] ||
              new Set(getColumnValues(activeFilter))
            : new Set()
        }
        onFilterChange={(values) =>
          activeFilter !== null && handleFilterChange(activeFilter, values)
        }
        columnName={activeFilter !== null ? headers[activeFilter] : ""}
      />
      {activeOverlay && (
        <RowOverlay
          key={`overlay-${activeOverlay.row}-${activeOverlay.col ?? "r"}`}
          rowIndex={activeOverlay.row}
          position={{ top: activeOverlay.top, left: activeOverlay.left }}
          onConfirm={() => {
            const hot = hotRef.current?.hotInstance;
            if (!hot) return;

            if (activeOverlay.type === ActiveOverlayType.EDIT) {
              onConfirmEdit(
                activeOverlay,
                handleConfirmEdit,
                commentRef,
                hotRef,
                removeEditOverlay,
              );
            } else if (
              activeOverlay.type === ActiveOverlayType.CELL_COMMENT ||
              activeOverlay.type === ActiveOverlayType.ROW_COMMENT
            ) {
              onConfirmComment(
                activeOverlay,
                handleConfirmComment,
                commentRef,
                hotRef,
                removeEditOverlay,
              );
            }
            setActiveOverlay(null);
            commentRef.current = "";
          }}
          onCancel={() => setActiveOverlay(null)}
          isLoading={false}
          showComment={true}
          commentRef={commentRef}
          isCommentRequired={
            activeOverlay.type === ActiveOverlayType.CELL_COMMENT ||
            activeOverlay.type === ActiveOverlayType.ROW_COMMENT
              ? true
              : isCommentMandatory
          }
        />
      )}

      {Array.from(new Set([...newRows, ...failedRows, ...loadingRows])).map(
        (rowIndex) =>
          overlayPositions[rowIndex] ? (
            <RowOverlay
              key={rowIndex}
              rowIndex={rowIndex}
              position={overlayPositions[rowIndex]}
              onConfirm={(idx) =>
                onConfirmAddRow(
                  idx,
                  setNewRows,
                  commentRef,
                  onConfirmRow,
                  hotRef,
                  setAddRowInprogress,
                  removeEditOverlay,
                )
              }
              onCancel={(idx) =>
                onCancelAddRow(
                  idx,
                  setNewRows,
                  onCancelRow,
                  hotRef,
                  setAddRowInprogress,
                  removeEditOverlay,
                )
              }
              isLoading={loadingRows.has(rowIndex)}
              showComment={true}
              commentRef={commentRef}
              isCommentRequired={hasAddPermission ? false : true}
            />
          ) : null,
      )}
    </div>
  );
};

export default React.memo(CustomHandsontable);
