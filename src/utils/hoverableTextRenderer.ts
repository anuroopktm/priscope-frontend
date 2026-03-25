import Handsontable from "handsontable";

export interface CellTextClickDetail {
  row: number;
  col: number;
  value: any;
}

export const HoverableTextRenderer: typeof Handsontable.renderers.TextRenderer =
  (
    instance: Handsontable.Core,
    td: HTMLTableCellElement,
    row: number,
    col: number,
    prop: string | number,
    value: any,
    cellProperties: Handsontable.CellProperties,
  ) => {
    // render default text
    Handsontable.renderers.TextRenderer(
      instance,
      td,
      row,
      col,
      prop,
      value,
      cellProperties,
    );

    // clear duplicate children
    td.innerHTML = "";

    const span = document.createElement("span");
    span.textContent = value ?? "";

    span.style.cursor = "pointer";
    span.style.color = "#666";

    span.onmouseenter = () => {
      span.style.color = "blue";
    };
    span.onmouseleave = () => {
      span.style.color = "#666";
    };

    span.onclick = () => {
      const event = new CustomEvent<CellTextClickDetail>("cellTextClick", {
        detail: { row, col, value },
      });
      window.dispatchEvent(event);
    };

    td.appendChild(span);
  };
