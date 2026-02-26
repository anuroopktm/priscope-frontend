import { useCallback, useEffect, useRef, useState } from "react";
import { buildItemMasterTreeGridBody, buildItemMasterTreeGridCols, getItemMasterLayout } from "../helpers/itemMasterTreeGridHelperFunction";
import type { TreeGridBody, TreeGridHeader, TreeGridLayout } from "../helpers/types";
import { useTreeGridInit } from "./use-tree-grid-init";

export const useItemsMasterGridData = ({
    gridId,
    containerId,
    itemMasterDataList,
    listHeaderData,
    debouncedSearchQuery,
    filter,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
}: any) => {
    const [layout, setLayout] = useState<TreeGridLayout | null>(null);
    const [data, setData] = useState<TreeGridBody | null>(null);
    const isInitialLoadRef = useRef(true);
    const isSearchReplaceRef = useRef(false);
    const prevSearchQueryRef = useRef<string>("");
    const prevFilterRef = useRef<string>("");
    const treeGridHeadersRef = useRef<TreeGridHeader[]>([]);

    useEffect(() => {
        if (prevSearchQueryRef.current !== debouncedSearchQuery) {
            prevSearchQueryRef.current = debouncedSearchQuery;
            if (!isInitialLoadRef.current) {
                isSearchReplaceRef.current = true;
            }
        }
    }, [debouncedSearchQuery]);

    useEffect(() => {
        const filterString = JSON.stringify(filter);
        if (prevFilterRef.current !== filterString) {
            prevFilterRef.current = filterString;
            if (!isInitialLoadRef.current) {
                isSearchReplaceRef.current = true;
            }
        }
    }, [filter]);

    const addRowsToGrid = useCallback((newRows: any[], Grid: any) => {
        if (!Grid || !newRows?.length) return;

        newRows.forEach((rowData) => {
            const newRow = Grid.AddRow(null, null, 7, rowData.id);
            if (!newRow) return;

            Object.entries(rowData).forEach(([key, value]) => {
                if (key === "id" || key === "Color" || value === undefined) return;
                Grid.SetValue(newRow, key, value, 1);
            });

            Grid.RefreshRow(newRow);
        });

        Grid.Update();
    }, []);

    const handleGridReady = useCallback((_grid: TGrid) => {
        console.log("handleGridReady");
    }, []);

    const gridInstance = useTreeGridInit(
        gridId,
        containerId,
        layout,
        data,
        handleGridReady,
    );

    useEffect(() => {
        if (!itemMasterDataList || !listHeaderData?.headers.length) return;

        const pages = itemMasterDataList.pages;
        const firstPageItems = pages[0]?.items ?? [];
        const body = buildItemMasterTreeGridBody(firstPageItems);
        setData(body);

        if (isInitialLoadRef.current) {
            if (!firstPageItems.length) return;
            const { cols } = buildItemMasterTreeGridCols(listHeaderData.headers);
            treeGridHeadersRef.current = cols;

            getItemMasterLayout(cols, listHeaderData).then(setLayout);
            setData(body);

            isInitialLoadRef.current = false;
            isSearchReplaceRef.current = false;
            return;
        }

        const Grid = gridInstance?.current;
        if (!Grid) return;

        if (isSearchReplaceRef.current) {
            setData((prev: any) => ({
                Body: [[...(prev?.Body?.[0] ?? []), ...(body?.Body?.[0] ?? [])]],
            }));

            Grid.Source.Data.Data = {
                Body: [body.Body[0] || []],
            };

            delete Grid.Source.Data.Url;
            Grid.ReloadBody();

            if (!isFetchingNextPage && hasNextPage) {
                fetchNextPage();
            }

            isSearchReplaceRef.current = false;
            return;
        }

        const lastPage = pages[pages.length - 1];
        const newItems = lastPage?.items ?? [];
        const dataToAdd = buildItemMasterTreeGridBody(newItems);
        addRowsToGrid(dataToAdd?.Body[0], Grid);
    }, [itemMasterDataList, listHeaderData, gridInstance, isFetchingNextPage, hasNextPage, fetchNextPage, addRowsToGrid]);

    return { gridInstance, layout, data, isSearchReplaceRef };
};
