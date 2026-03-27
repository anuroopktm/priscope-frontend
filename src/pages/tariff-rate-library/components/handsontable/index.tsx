import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "@/components/common/handsontable/HandsontableCustom.scss";
import Handsontable from "handsontable";
import {
  ActiveOverlayType,
  type ActiveOverlay,
} from "@/components/common/handsontable/types";
import { useConfirm } from "@/pages/items-master-refactor/utils/ModalProvider";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";
import CityAutocompleteEditor from "@/utils/cityAutoCompleteEditor";
import { HoverableTextRenderer } from "@/utils/hoverableTextRenderer";
import { dateValidationRenderer } from "@/utils/dateValidationRenderer";
import {
  getHandleBeforeContextMenuSetItems,
  getHandleContextMenuCallback,
} from "@/helpers/handsontableHandlers";
import RowOverlay from "@/components/common/handsontable/row-overlay";
import { FilterDropdown } from "@/components/common/handsontable/filter-dropdown";

registerAllModules();

interface TariffHandsontableProps {
  hotRef: any;
  headers: string[];
  values: any[][];
  readOnlyColumns?: string[];
  onRowClick?: (rowData: any) => void;
  onConfirmRow?: (rowIndex: number, comment: string) => void;
  onCancelRow?: (rowIndex: number) => void;
  failedRows?: Set<number>;
  loadingRows?: Set<number>;
  setAddRowInProgress?: (value: boolean) => void;
  addRowInProgress?: boolean;
  setSelectedRows?: any;
  selectedRows?: Record<number, boolean>;
  setShowLoader?: (value: boolean) => void;
  highlightTarget: {
    tariffRateId: string | null;
    fieldKey?: string | null;
  };
  columnFieldMap: Record<number, string>;
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
  commentMantatoryFields?: string[];
  onLoadMore?: () => void;
  // onTariffRateIdNotFound?: (tariffRateId: string) => void;
  onTariffRateIdNotFound?: (tariffRateId: string) => Promise<boolean>;
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
  hasEditPermission: boolean;
  hasAddPermission: boolean;
  setHighlightTarget: any;
}

const TariffHandsontable: React.FC<TariffHandsontableProps> = ({
  hotRef,
  headers,
  values,
  readOnlyColumns = [],
  onRowClick,
  onConfirmRow,
  onCancelRow,
  failedRows = new Set(),
  loadingRows = new Set(),
  setAddRowInProgress,
  addRowInProgress,
  setSelectedRows,
  selectedRows = {},
  // setShowLoader,
  highlightTarget,
  setHighlightTarget,
  columnFieldMap,
  handleConfirmEdit,
  commentMantatoryFields = [],
  onLoadMore,
  onTariffRateIdNotFound,
  selectAll,
  setSelectAll,
  hasEditPermission,
  hasAddPermission,
  handleConfirmComment,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const commentRef = useRef<string>("");

  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay | null>(
    null,
  );
  const [isCommentMandatory, setIsCommentMandatory] = useState(true);
  const [columnFilters, setColumnFilters] = useState<
    Record<number, Set<string | number>>
  >({});
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });
  const [filteredData, setFilteredData] = useState<any[][]>(values);
  const [newRows, setNewRows] = useState<Set<number>>(new Set());
  const [overlayPositions, setOverlayPositions] = useState<
    Record<number, { top: number; left: number }>
  >({});
  const [retryKey, setRetryKey] = useState(0);
  const prevDataLengthRef = useRef(values.length);
  const [confirmationModalVisible, setConformationModalVisible] =
    useState(false);

  const confirm = useConfirm();

  // Retrieve unique column values for filtering
  const tariffData = values;
  const getColumnValues = useCallback(
    (columnIndex: number): (string | number)[] => {
      const values = tariffData.map((row) => row[columnIndex]);
      return [...new Set(values)].sort();
    },
    [tariffData],
  );

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

  // Update column filters
  const handleFilterChange = (
    columnIndex: number,
    selectedValues: Set<string | number>,
  ) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnIndex]: selectedValues,
    }));
  };

  // Filter data based on columnFilters
  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    hot.suspendRender();
    let filtered = values;

    Object.entries(columnFilters).forEach(([colIndex, selectedValues]) => {
      const columnIndex = parseInt(colIndex);
      if (selectedValues.size > 0) {
        filtered = filtered.filter((row) =>
          selectedValues.has(row[columnIndex]),
        );
      }
    });

    setFilteredData(filtered);

    if (hotRef.current?.hotInstance) {
      hotRef.current.hotInstance.loadData(filtered);
    }

    hot.resumeRender();
  }, [columnFilters, values]);

  // Set up filter button event listeners
  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("filter-btn")) {
        const colIndex = parseInt(target.dataset.col || "0", 10);
        if (colIndex < headers.length - 2) {
          handleFilterIconClick(colIndex, e);
        }
      }
    };

    hot?.rootElement?.addEventListener("click", handleClick);
    return () => {
      hot?.rootElement?.removeEventListener("click", handleClick);
    };
  }, [activeFilter, headers.length]);

  // Detect new rows
  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    if (values.length > prevDataLengthRef.current && addRowInProgress) {
      setNewRows((prev) => new Set([0, ...prev]));
      hot.scrollViewportTo(0, 0);
    }
    prevDataLengthRef.current = values.length;
  }, [values, addRowInProgress]);

  // Update overlay positions
  const updateOverlayPosition = (rowIndex: number) => {
    const hot = hotRef.current?.hotInstance;
    const wrapperEl = wrapperRef.current;
    if (
      !hot ||
      !wrapperEl ||
      (!newRows.has(rowIndex) &&
        !failedRows.has(rowIndex) &&
        !loadingRows.has(rowIndex))
    ) {
      return;
    }

    const wrapperRect = wrapperEl.getBoundingClientRect();
    const lastCol = headers.length - 3; // Last visible column (before hidden id/status)
    const cell = hot.getCell(rowIndex, lastCol);

    if (cell) {
      const cellRect = cell.getBoundingClientRect();
      const overlayW = 80;
      const overlayH = 40;

      let left = cellRect.right - wrapperRect.left - overlayW - 229;
      let top = cellRect.bottom - wrapperRect.top;

      const maxLeft = wrapperRect.width - overlayW + 5;
      if (left > maxLeft) left = maxLeft;
      if (left < 6) left = 6;
      top = Math.max(4, Math.min(top, wrapperRect.height - overlayH - 4));

      setOverlayPositions((prev) => ({
        ...prev,
        [rowIndex]: { top, left },
      }));
    }
  };

  // Resize observer for overlay positions
  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    if (!wrapperEl) return;

    const observer = new ResizeObserver(() => {
      const rowsToUpdate = new Set([...newRows, ...failedRows, ...loadingRows]);
      rowsToUpdate.forEach((rowIndex) => updateOverlayPosition(rowIndex));
    });

    observer.observe(wrapperEl);
    return () => observer.disconnect();
  }, [newRows, failedRows, loadingRows]);

  // Row headers with checkboxes
  const afterGetRowHeader = (row: number, th: HTMLElement) => {
    const hot = hotRef.current?.hotInstance;
    th.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "row-header-wrapper";
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "center";
    wrapper.style.alignItems = "center";
    wrapper.style.height = "100%";
    wrapper.style.position = "relative";

    const id = hot?.getDataAtCell(row, 7);
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = selectAll ? selectAll : !!selectedRows?.[id];
    input?.addEventListener("change", () => {
      setSelectedRows((prev: any) => ({
        ...prev,
        [id]: !prev[id],
      }));
    });
    wrapper.appendChild(input);

    th.appendChild(wrapper);
    th.parentElement?.classList.toggle("new-row", newRows.has(row));
    th.parentElement?.classList.toggle("failed-row", failedRows.has(row));
  };

  // Select all checkbox in column header
  const afterGetColHeader = (col: number, TH: HTMLElement) => {
    const hot = hotRef.current?.hotInstance;
    const headerText = TH.querySelector(".header-text") as HTMLElement | null;

    if (col === -1) {
      TH.innerHTML = "";
      const wrapper = document.createElement("div");
      wrapper.className = "row-header-wrapper";
      wrapper.style.display = "flex";
      wrapper.style.justifyContent = "center";
      wrapper.style.alignItems = "center";
      wrapper.style.height = "100%";
      wrapper.style.position = "relative";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = selectAll;
      input?.addEventListener("change", () => {
        setSelectAll(!selectAll);
        if (selectAll == true) {
          hot.deselectCell();
        }
      });
      wrapper.appendChild(input);

      TH.appendChild(wrapper);
    }

    if (headerText && hot) {
      headerText.onclick = (e: Event) => {
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
      };
    }
  };

  // useEffect(() => {
  //   const hot = hotRef.current?.hotInstance;
  //   if (!hot || !highlightTarget.tariffRateId) return;

  //   const tryHighlight = () => {
  //     const rowIndex = hot
  //       .getSourceData()
  //       .findIndex((row: any[]) => row[7] === highlightTarget.tariffRateId);

  //     if (rowIndex === -1) {
  //       // Call parent callback if ID not found, then retry via state update when done
  //       onTariffRateIdNotFound?.(highlightTarget.tariffRateId).then(
  //         (res: boolean) => {
  //           if (res) {
  //             setRetryKey((prev) => prev + 1);
  //           }
  //         },
  //       );
  //       return;
  //     }

  //     if (!highlightTarget.fieldKey) {
  //       hot.selectCell(rowIndex, 0, rowIndex, hot.countCols() - 1, true);
  //       setHighlightTarget({ tariffRateId: null, fieldKey: null });
  //     } else {
  //       const colIndex = Number(
  //         Object.keys(columnFieldMap).find(
  //           (col) => columnFieldMap[+col] === highlightTarget.fieldKey,
  //         ),
  //       );

  //       if (!isNaN(colIndex)) {
  //         hot.selectCell(rowIndex, colIndex, rowIndex, colIndex, true);
  //         setHighlightTarget({ tariffRateId: null, fieldKey: null });
  //       }
  //     }
  //     hot.render();
  //   };

  //   // Delay highlight until after data update + re-render
  //   setTimeout(tryHighlight, 300);
  // }, [highlightTarget, columnFieldMap, onTariffRateIdNotFound, retryKey]);

  useEffect(() => {
    const hot = hotRef.current?.hotInstance;
    const tariffRateId = highlightTarget.tariffRateId;

    if (!hot || !tariffRateId) return;

    const tryHighlight = () => {
      const rowIndex = hot
        .getSourceData()
        .findIndex((row: any[]) => row[7] === tariffRateId);

      if (rowIndex === -1) {
        onTariffRateIdNotFound?.(tariffRateId)?.then((res: boolean) => {
          if (res) {
            setRetryKey((prev) => prev + 1);
          }
        });
        return;
      }

      if (!highlightTarget.fieldKey) {
        hot.selectCell(rowIndex, 0, rowIndex, hot.countCols() - 1, true);
        setHighlightTarget({ tariffRateId: null, fieldKey: null });
      } else {
        const colIndex = Number(
          Object.keys(columnFieldMap).find(
            (col) => columnFieldMap[+col] === highlightTarget.fieldKey,
          ),
        );

        if (!isNaN(colIndex)) {
          hot.selectCell(rowIndex, colIndex, rowIndex, colIndex, true);
          setHighlightTarget({ tariffRateId: null, fieldKey: null });
        }
      }

      hot.render();
    };

    setTimeout(tryHighlight, 300);
  }, [highlightTarget, columnFieldMap, onTariffRateIdNotFound, retryKey]);

  const colHeaders = useCallback(
    (col: number) => {
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
    },
    [columnFilters, getColumnValues, headers],
  );

  useEffect(() => {
    const handler = (e: any) => {
      const { row, col } = e.detail;

      if (newRows.has(row) || failedRows.has(row)) return;
      if (col === 0 || col === 1) {
        const rowData = getDataAtRow(row);
        onRowClick?.(rowData);
      }
    };

    window.addEventListener("cellTextClick", handler);
    return () => window.removeEventListener("cellTextClick", handler);
  }, []);

  useEffect(() => {
    loadGoogleMaps();
  }, []);

  const columns = useMemo(
    () =>
      headers.map((header, colIndex) => {
        const columnConfig: any = {};

        if (readOnlyColumns.includes(header)) {
          columnConfig.readOnly = true;
        }

        if (colIndex === 0 || colIndex === 1) {
          columnConfig.type = "text";
          columnConfig.editor = CityAutocompleteEditor;
          columnConfig.placeOptions = { mode: "country" };
          columnConfig.renderer = HoverableTextRenderer;
        }

        if (colIndex === 4) {
          columnConfig.type = "date";
          columnConfig.dateFormat = "YYYY-MM-DD";
          columnConfig.correctFormat = true;
          columnConfig.allowInvalid = false;
          columnConfig.placeholder = "Select";
          columnConfig.renderer = dateValidationRenderer(
            addRowInProgress && failedRows.size > 0,
          );
          columnConfig.datePickerConfig = {
            reposition: true,
            onOpen: function () {
              requestAnimationFrame(() => {
                const picker = this.el;
                const rect = picker.getBoundingClientRect();
                const containerRect =
                  wrapperRef.current!.getBoundingClientRect();

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
      }),
    [headers, readOnlyColumns, selectedRows, failedRows, newRows],
  );

  // useEffect(() => {
  //   const hot = hotRef.current?.hotInstance;
  //   if (activeOverlay?.type === ActiveOverlayType.EDIT) {
  //     const { row, col } = activeOverlay;
  //     const colHeader = headers[col];
  //     const field = commentMantatoryFields?.find(
  //       (value) => value === colHeader,
  //     );
  //     const required = !hasEditPermission ? true : !!field;

  //     setIsCommentMandatory(required);
  //     highlightCell(hot, row, col);
  //   }
  // }, [activeOverlay, headers, commentMantatoryFields]);

  useEffect(() => {
    const hot = hotRef.current?.hotInstance;

    if (activeOverlay?.type === ActiveOverlayType.EDIT) {
      const { row, col } = activeOverlay;

      if (row === undefined || col === undefined) return;

      const colHeader = headers[col];
      const field = commentMantatoryFields?.find(
        (value) => value === colHeader,
      );

      const required = !hasEditPermission ? true : !!field;

      setIsCommentMandatory(required);
      highlightCell(hot, row, col);
    }
  }, [activeOverlay, headers, commentMantatoryFields]);

  const handleAfterBeginEditing = async (row: number, col: number) => {
    const hot = hotRef.current?.hotInstance;
    if (!hot || addRowInProgress) return;
    if (
      !hasEditPermission &&
      activeOverlay?.type != ActiveOverlayType.EDIT &&
      !confirmationModalVisible
    ) {
      setConformationModalVisible(true);
      const result = await confirm({
        header: "Admin Approval Required!",
        message:
          "You don’t have permission to add a new rate, but you can suggest new rates for admin approval. They will take effect once approved.",
        confirmButtonText: "Understood",
        cancelButtonText: "Cancel",
      });
      if (result) {
        setConformationModalVisible(false);
        hot.selectCell(row, col);
        hot.getActiveEditor().beginEditing();
      } else {
        hot.deselectCell();
        setConformationModalVisible(false);
        return;
      }
    }
    beginEdit(hot, row, col);
  };

  const beginEdit = (hot: any, row: number, col: number) => {
    const td = hot.getCell(row, col);
    if (td && wrapperRef.current) {
      const oldValue = hot.getDataAtCell(row, col);
      scheduleOverlayUpdate(td, row, col, oldValue);
    }
  };

  function scheduleOverlayUpdate(
    td: HTMLElement,
    row: number,
    col: number,
    oldValue: string,
  ) {
    requestAnimationFrame(() => {
      const tdRect = td.getBoundingClientRect();
      const containerRect = wrapperRef.current!.getBoundingClientRect();

      let top = tdRect.top - containerRect.top + (tdRect.height + 2);
      const left = tdRect.left - containerRect.left - 150;

      if (top + 120 > containerRect.height) {
        top = top - (135 + tdRect.height);
      }
      setActiveOverlay({
        row,
        col,
        oldValue,
        top,
        left,
        type: ActiveOverlayType.EDIT,
      });
    });
  }

  const removeEditOverlay = () => {
    if (activeOverlay?.type === ActiveOverlayType.EDIT) setActiveOverlay(null);
  };

  const getDataAtRow = (rowIndex: number) => {
    let rowValues = [];
    const hot = hotRef.current?.hotInstance;
    if (hot) {
      rowValues = hot.getDataAtRow(rowIndex);
    }
    return rowValues;
  };

  function highlightCell(hot: any, row: number, col: number, error = false) {
    if (error) {
      hot.setCellMeta(row, col, "className", "hot-error-border");
    } else {
      hot.setCellMeta(row, col, "className", "hot-normal-border");
    }
    hot.render();
  }

  const handleAfterScrollVertically = () => {
    if (activeOverlay?.type === ActiveOverlayType.EDIT) {
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

  const handleAfterChange = (changes: any, source: any) => {
    if (!changes || source === "loadData") return;
    const hot = hotRef.current?.hotInstance;
    changes.forEach(
      ([row, col, newValue]: [number, number, string, string]) => {
        if (
          newValue === null ||
          newValue === undefined ||
          (typeof newValue === "string" && newValue.trim() === "") ||
          (typeof newValue === "number" &&
            (Number.isNaN(newValue) || newValue === 0))
        ) {
          highlightCell(hot, row, col, true);
          return;
        }
      },
    );
  };

  return (
    <div style={{ position: "relative" }} ref={wrapperRef}>
      {addRowInProgress && (
        <div
          style={{
            position: "absolute",
            top: 75,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0)",
            zIndex: 99,
          }}
        />
      )}
      <HotTable
        ref={hotRef}
        data={filteredData}
        colHeaders={colHeaders}
        rowHeaders={true}
        licenseKey="non-commercial-and-evaluation"
        columns={columns}
        className="custom-hot ht-theme-horizon "
        width="100%"
        stretchH="all"
        hiddenColumns={{
          columns: [7, 8],
          indicators: false,
        }}
        afterGetRowHeader={afterGetRowHeader}
        afterGetColHeader={afterGetColHeader}
        afterBeginEditing={handleAfterBeginEditing}
        afterScrollVertically={handleAfterScrollVertically}
        columnSorting={{
          indicator: false,
        }}
        afterChange={handleAfterChange}
        afterGetCellMeta={(row, col, cellProperties) => {
          const hot = hotRef.current?.hotInstance;
          if (!hot) return;

          const lastColIndex = hot.countCols() - 1;
          const lastColValue = hot.getDataAtCell(row, lastColIndex);

          if (lastColValue === "inactive") {
            cellProperties.readOnly = true;
            cellProperties.className = `${cellProperties.className ?? ""} inactive-cell`;
          }
          if (col === 5 || col === 6) {
            cellProperties.readOnly = true;
          }
        }}
        fillHandle={false}
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
      {activeOverlay && !addRowInProgress && (
        <RowOverlay
          key={1}
          rowIndex={activeOverlay.row}
          position={{ top: activeOverlay.top, left: activeOverlay.left }}
          onConfirm={() => {
            const data = getDataAtRow(activeOverlay.row);

            if (activeOverlay.type === ActiveOverlayType.EDIT) {
              const value = data[activeOverlay.col!];
              if (!value) return;
              handleConfirmEdit(activeOverlay, data, commentRef.current);
            } else if (
              activeOverlay.type === ActiveOverlayType.ROW_COMMENT ||
              activeOverlay.type === ActiveOverlayType.CELL_COMMENT
            ) {
              handleConfirmComment(activeOverlay, data, commentRef.current);
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
      {Array.from(new Set([...newRows, ...failedRows, ...loadingRows])).map(
        (rowIndex) =>
          overlayPositions[rowIndex] ? (
            <RowOverlay
              key={rowIndex}
              rowIndex={rowIndex}
              position={overlayPositions[rowIndex]}
              onConfirm={(idx) => {
                setNewRows((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(idx);
                  return newSet;
                });
                const comment = commentRef.current || "";
                onConfirmRow?.(idx, comment);
              }}
              onCancel={(idx) => {
                setNewRows((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(idx);
                  return newSet;
                });
                onCancelRow?.(idx);
                const hotInstance = hotRef.current?.hotInstance;
                if (hotInstance) {
                  hotInstance.deselectCell();
                }
                setAddRowInProgress?.(false);
              }}
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

export default TariffHandsontable;
