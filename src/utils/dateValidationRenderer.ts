import { WARNING_DAYS_LIMIT } from "@/pages/freight-rate-library/constants/data-validation.constants";
import {
  addDays,
  differenceInCalendarDays,
  isToday,
  isWithinInterval,
} from "date-fns";
import Handsontable from "handsontable";

type HTRenderer = (
  instance: any,
  td: HTMLTableCellElement,
  row: number,
  // col: number,
  // prop: string | number,
  value: any,
  cellProperties?: any,
) => void;

export const dateValidationRenderer =
  (showRedBorder: boolean = false): HTRenderer =>
  (
    instance: Handsontable,
    td: HTMLTableCellElement,
    row: number,
    // col: number,
    // prop: string | number,
    value: string | null,
    cellProperties: Handsontable.CellProperties,
  ): void => {
    Handsontable.dom.empty(td);
    td.className = "htLeft htMiddle valid-until-cell";
    if (showRedBorder && row === 0) {
      td.style.border = "1px solid red";
    }

    if (!value) {
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";
      wrapper.style.justifyContent = "space-between";
      wrapper.style.width = "100%";

      const spanText = document.createElement("span");
      spanText.textContent = cellProperties.placeholder || "Select";
      spanText.style.color = "#aaa";

      const iconWrapper = document.createElement("span");
      iconWrapper.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="#666" stroke-width="2"/>
        <path d="M16 3V7" stroke="#666" stroke-width="2" stroke-linecap="round"/>
        <path d="M8 3V7" stroke="#666" stroke-width="2" stroke-linecap="round"/>
        <path d="M3 11H21" stroke="#666" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
      iconWrapper.style.display = "inline-flex";
      iconWrapper.style.alignItems = "center";

      wrapper.appendChild(spanText);
      wrapper.appendChild(iconWrapper);
      td.appendChild(wrapper);
      return;
    }

    const wrapper = document.createElement("span");
    wrapper.style.display = "inline-flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "4px";

    let cellDate: Date | null = null;
    // const parts = (value ?? "").split("-").map(Number);
    const stringValue = typeof value === "string" ? value : String(value ?? "");
    const parts = stringValue.split("-").map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      const [year, month, day] = parts;
      cellDate = new Date(year, month - 1, day);
    }

    let textColor = "";
    let svgIcon: string | null = null;
    if (cellDate instanceof Date && !isNaN(cellDate.getTime())) {
      const today = new Date();
      const isWithinWarningPeriod = isWithinInterval(cellDate, {
        start: today,
        end: addDays(today, WARNING_DAYS_LIMIT - 1),
      });

      if (isToday(cellDate) || isWithinWarningPeriod) {
        textColor = "#ED882A";
        svgIcon = `<svg width="16" height="16" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.66667 16.6663C12.3486 16.6663 15.3333 13.6816 15.3333 9.99967C15.3333 6.31778 12.3486 3.33301 8.66667 3.33301C4.98477 3.33301 2 6.31778 2 9.99967C2 13.6816 4.98477 16.6663 8.66667 16.6663Z" stroke="#ED882A" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.66699 7.33301V9.99967L10.0003 11.333" stroke="#ED882A" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
      } else if (differenceInCalendarDays(new Date(), cellDate) > 0) {
        textColor = "#DF1E1E";
        svgIcon = `<svg width="16" height="16" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.66147 12.6667H8.66747M8.66681 10.6667V8.00008M4.21481 8.45541C5.82347 5.60808 6.62814 4.18474 7.73214 3.81808C8.33897 3.61663 8.99464 3.61663 9.60147 3.81808C10.7055 4.18474 11.5101 5.60808 13.1188 8.45541C14.7281 11.3021 15.5321 12.7261 15.2915 13.8861C15.1581 14.5247 14.8315 15.1034 14.3568 15.5394C13.4941 16.3334 11.8848 16.3334 8.66681 16.3334C5.44881 16.3334 3.83947 16.3334 2.97681 15.5401C2.5003 15.1 2.17347 14.5219 2.04214 13.8867C1.80081 12.7267 2.60547 11.3027 4.21481 8.45541Z" stroke="#DF1E1E" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
      }

      if (svgIcon) {
        const iconWrapper = document.createElement("span");
        iconWrapper.innerHTML = svgIcon;
        iconWrapper.style.display = "inline-flex";
        iconWrapper.style.alignItems = "center";
        iconWrapper.style.justifyContent = "center";
        iconWrapper.style.verticalAlign = "middle";
        iconWrapper.style.width = "16px";
        iconWrapper.style.height = "16px";
        wrapper.appendChild(iconWrapper);
      }
    }
    const spanText = document.createElement("span");

    const rowDataArray = instance.getDataAtRow(row);
    if (rowDataArray[rowDataArray.length - 1] === "inactive") {
      td.style.backgroundColor = "#13111110 ";
      spanText.style.color = "#777777";
    }
    spanText.textContent = value ?? "";
    if (textColor) spanText.style.color = textColor;
    wrapper.appendChild(spanText);

    td.appendChild(wrapper);
  };
