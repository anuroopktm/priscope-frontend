import Handsontable from "handsontable";


class ContainerTypeEditor extends Handsontable.editors.BaseEditor {
  dropdown: HTMLDivElement | null = null;
  searchInput: HTMLInputElement | null = null;
  suggestions: string[] = [];
  activeIndex: number = -1;
  source: string[] = [];
  private value: any = null;

  constructor(props: any) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  prepare(
    row: number,
    col: number,
    prop: string | number,
    td: HTMLElement,
    value: any,
    cellProperties: Handsontable.CellProperties
  ) {
    super.prepare(row, col, prop, td, value, cellProperties);

    if (Array.isArray(cellProperties.source)) {
      this.source = cellProperties.source.filter(
        (item): item is string => typeof item === "string"
      );
    } else {
      this.source = [];
    }
    this.value = value;
  }

  open() {
    this.suggestions = this.source;

    if (!this.dropdown) {
      this.dropdown = document.createElement("div");
      Object.assign(this.dropdown.style, {
        position: "absolute",
        background: "#fff",
        borderRadius: "8px",
        zIndex: "99999",
        maxHeight: "300px",
        overflowY: "auto",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "13px",
        outline: "none",
        display: "flex",
        flexDirection: "column",
      });

      this.searchInput = document.createElement("input");
      Object.assign(this.searchInput.style, {
        padding: "6px 10px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        outline: "none",
        fontSize: "13px",
        margin: "8px",
        marginBottom: "0",
        boxSizing: "border-box",
      });
      this.searchInput.placeholder = "Search";

      this.searchInput.addEventListener("input", this.handleSearch);

      this.dropdown.appendChild(this.searchInput);

      document.body.appendChild(this.dropdown);
    } else {
      this.dropdown.style.display = "flex";
    }

    this.positionDropdown();
    this.renderDropdown(this.suggestions);

    this.hot.addHook("afterDocumentKeyDown", this.handleKeyDown);
    document.addEventListener("mousedown", this.handleOutsideClick, {
      capture: true,
    });

    setTimeout(() => this.searchInput?.focus(), 10);
  }

  focus() {
    this.searchInput?.focus();
  }

  positionDropdown() {
    if (!this.dropdown || !this.TD) return;
    const rect = this.TD.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    this.dropdown.style.left = rect.left + scrollLeft + "px";
    this.dropdown.style.top = rect.bottom + scrollTop + "px";
    this.dropdown.style.width = rect.width + "px";
  }

  handleSearch() {
    const query = this.searchInput?.value.toLowerCase() || "";
    if (query) {
      this.suggestions = this.source.filter((s) =>
        s.toLowerCase().includes(query)
      );
    } else {
      this.suggestions = this.source;
    }
    this.renderDropdown(this.suggestions, query);
  }

  renderDropdown(predictions: string[], query: string = "") {
  if (!this.dropdown) return;

  while (this.dropdown.children.length > 1) {
    this.dropdown.removeChild(this.dropdown.lastChild!);
  }

  this.activeIndex = -1;

  if (predictions.length === 0 && query) {
    // Ensure search input is visible and reflects the query
    if (this.searchInput) {
      this.searchInput.value = query; // Sync input with query
    }

    // Create container for value and "Create new" button
    const createContainer = document.createElement("div");
    Object.assign(createContainer.style, {
      display: "flex",
      alignItems: "center",
      padding: "8px 16px", // Consistent padding
      boxSizing: "border-box",
      justifyContent: "space-between",
    });

    // Display the entered value
    const valueSpan = document.createElement("span");
    valueSpan.textContent = query;
    Object.assign(valueSpan.style, {
      marginRight: "10px", // Space between value and button
      color: "#333", // Darker text for contrast
      fontSize: "13px",
    });

      // Create "Create new" button
      const createBtn = document.createElement("div");
      createBtn.textContent = "Create new";
      Object.assign(createBtn.style, {
        cursor: "pointer",
        userSelect: "none",
        color: "#144E72",
        fontWeight: "600",
        backgroundColor: "#fff",
        boxSizing: "border-box",
      });

      // Append value and button to container
      
      createBtn.addEventListener("mousedown", async (ev) => {
        ev.preventDefault();

        const typeValue = query;

        try {
          // If mutation function is passed via cellProperties
          const createFn = (this.cellProperties as any).onCreateContainerType;

          if (createFn && typeof createFn === "function") {
            // Call API
            const response = await createFn({ type: typeValue });

            // Update the source array with the new type
            if (!this.source.includes(response.type)) {
              this.source.push(response.type);
              this.cellProperties.source = [...this.source]; // Ensure a new array reference
            }

            // Set the new value directly in the cell
            this.setValue(response.type);
          } else {
            // Fallback if no API provided
            if (!this.source.includes(typeValue)) {
              this.source.push(typeValue);
              this.cellProperties.source = [...this.source]; // Ensure a new array reference
            }
            this.setValue(typeValue);
          }

          // Update the Handsontable column configuration to reflect the new source
          const columns = this.hot.getSettings().columns;
          if (columns) {
            let columnConfig: Handsontable.ColumnSettings | undefined;
            if (Array.isArray(columns)) {
              columnConfig = columns[this.col];
            } else if (typeof columns === "function") {
              columnConfig = columns(this.col);
            }
            if (columnConfig && Array.isArray(columnConfig.source)) {
              const source = columnConfig.source as string[]; // Type assertion to mutable string array
              const newValue = this.getValue() as string; // Ensure getValue is treated as string
              if (!source.includes(newValue)) {
                source.push(newValue);
              }
            }
          }

          // Set the cell value and refresh the dropdown
          this.hot.setDataAtCell(this.row, this.col, this.getValue(), "edit");
          this.suggestions = [...this.source]; // Update suggestions to reflect new source
          this.renderDropdown(this.suggestions); // Re-render dropdown with updated source
          this.finishEditing(false);
          this.close();
        } catch (error) {
          console.error("Failed to create container type:", error);
          // Optional: show error UI
        }
      });

      createContainer.appendChild(valueSpan);
      createContainer.appendChild(createBtn);

      // Append container to dropdown
      this.dropdown.appendChild(createContainer);
      this.positionDropdown();
      return;
    }

  predictions.forEach((p, idx) => {
    const item = document.createElement("div");
    item.textContent = p;
    Object.assign(item.style, {
      padding: "8px 10px",
      cursor: "pointer",
      userSelect: "none",
    });

    item.addEventListener("mousedown", (ev) => {
      ev.preventDefault();
      this.selectSuggestion(idx);
    });

    item.addEventListener("mouseover", () => {
      this.setActive(idx);
    });

    this.dropdown!.appendChild(item);
  });

  this.positionDropdown();
}

  setActive(idx: number) {
    if (!this.dropdown) return;
    const children = Array.from(this.dropdown.children).slice(
      1
    ) as HTMLDivElement[];
    children.forEach((c, i) => {
      c.style.background = i === idx ? "#e6f2ff" : "#fff";
    });
    this.activeIndex = idx;

    const activeEl = children[idx];
    if (activeEl) {
      const ddRect = this.dropdown.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      if (elRect.top < ddRect.top) {
        this.dropdown.scrollTop -= ddRect.top - elRect.top;
      } else if (elRect.bottom > ddRect.bottom) {
        this.dropdown.scrollTop += elRect.bottom - ddRect.bottom;
      }
    }
  }

  selectSuggestion(idx: number) {
    const p = this.suggestions[idx];
    if (!p) return;

    this.setValue(p);
    this.hot.setDataAtCell(this.row, this.col, this.getValue(), "edit");

    this.finishEditing(false);
    this.close();
  }

  handleKeyDown(e: KeyboardEvent) {
    if (!this.dropdown || !this.dropdown.childElementCount) return;

    const children = Array.from(this.dropdown.children).slice(
      1
    ) as HTMLDivElement[];

    if (e.key === "ArrowDown") {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.setActive(Math.min(this.activeIndex + 1, children.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.setActive(Math.max(this.activeIndex - 1, 0));
    } else if (e.key === "Enter") {
      if (this.activeIndex >= 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.selectSuggestion(this.activeIndex);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.finishEditing(true);
      this.close();
    } else if (e.key === "Tab") {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.finishEditing(true);
      this.close();
    }
  }

  handleOutsideClick(evt: MouseEvent) {
    if (!this.dropdown || !this.TD) return;
    const target = evt.target as Node;
    const isDropdownClick = this.dropdown.contains(target);
    const isCellClick = this.TD.contains(target);

    if (!isDropdownClick && !isCellClick) {
      evt.stopImmediatePropagation();
      this.finishEditing(true);
      this.close();
    }
  }

  hideDropdown() {
    if (this.dropdown) {
      this.dropdown.style.display = "none";
      this.suggestions = [];
      this.activeIndex = -1;
      if (this.searchInput) {
        this.searchInput.value = "";
      }
    }
  }

  close() {
    this.hideDropdown();
    this.hot.removeHook("afterDocumentKeyDown", this.handleKeyDown);
    document.removeEventListener("mousedown", this.handleOutsideClick, {
      capture: true,
    });
  }

  destroy() {
    super.destroy();
    if (this.dropdown) {
      try {
        document.body.removeChild(this.dropdown);
      } catch (e) {}
      this.dropdown = null;
      this.searchInput = null;
    }
  }

  getValue() {
    return this.value;
  }

  setValue(value: any) {
    this.value = value;
  }
}

export default ContainerTypeEditor;
