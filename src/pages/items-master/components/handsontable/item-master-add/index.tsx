import React, { useRef, useState } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "@/shared/components/handsontable/HandsontableCustom.scss";

registerAllModules();

interface ItemMasterHandsontableProps {
  headers: string[];
  onDataChange: (data: any[][]) => void;
  errorRows: number[]
  data: any
  hiddenColumnIndices: number[]
}

const MIN_ROWS = 10;

const ItemMasterAddTable: React.FC<ItemMasterHandsontableProps> = ({
  headers,
  onDataChange,
  errorRows,
  data = [],
  hiddenColumnIndices
}) => {
  const hotRef = useRef<any>(null);

  // Read current table data and send to parent
  const handleDataChange = () => {
    const hot = hotRef.current?.hotInstance;
    if (hot) {
      const allData = hot.getData();
      onDataChange(allData);
    }
  };

  // notify parent on data change
  const handleAfterChange = (changes: any) => {
    if (changes) {
      handleDataChange();
    }
  };

  const handleGetCellMeta = (
    row: number,
    col: number,
    cellProperties: any,
    hotRef: any
  ) => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    if (errorRows?.includes(row)) {
      cellProperties.className = `hot-error-border`;
    }
  };

  return (
    <div>
      <HotTable
        data={data || []}
        ref={hotRef}
        colHeaders={headers}
        rowHeaders={true}
        columns={headers.map(() => ({}))}
        minRows={MIN_ROWS}
        licenseKey="non-commercial-and-evaluation"
        className="custom-hot ht-theme-horizon"
        width="100%"
        stretchH="all"
        minSpareRows={1}
        afterChange={handleAfterChange}
        afterGetCellMeta={(row, col, cellProperties) =>
          handleGetCellMeta(row, col, cellProperties, hotRef)
        }
        hiddenColumns={{ columns: [0, ...hiddenColumnIndices ?? []] }}
      />
    </div>
  );
};

export default ItemMasterAddTable;
