import Handsontable from "handsontable";

// Custom renderer for Supplier/Customer columns
export const arrayPreviewRenderer: Handsontable.renderers.Base = (
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) => {
  Handsontable.renderers.BaseRenderer(instance, td, row, col, prop, value, cellProperties);
  td.innerHTML = "";

  if (!value) return;

  // Convert comma-separated string -> array
  const items =
    Array.isArray(value)
      ? value
      : typeof value === "string"
      ? value.split(",").map((v) => v.trim()).filter(Boolean)
      : [];

  if (items.length === 0) return;

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.gap = "4px";

  // First visible pill
  const first = document.createElement("span");
  first.textContent = items[0];
  Object.assign(first.style, {
    background: "#f1f5f9",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
  });
  container.appendChild(first);

  // "+N" pill for remaining
  const extraCount = items.length - 1;
  if (extraCount > 0) {
    const more = document.createElement("span");
    more.textContent = `+${extraCount}`;
    more.title = items.join(", "); // tooltip with all names
    Object.assign(more.style, {
      background: "#e2e8f0",
      padding: "2px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      cursor: "pointer",
    });
    container.appendChild(more);
  }

  td.appendChild(container);
};
