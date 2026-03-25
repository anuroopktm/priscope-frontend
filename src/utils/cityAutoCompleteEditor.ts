import Handsontable from "handsontable";

class CityAutocompleteEditor extends Handsontable.editors.TextEditor {
  service: google.maps.places.AutocompleteService | null = null;
  dropdown: HTMLDivElement | null = null;
  suggestions: google.maps.places.AutocompletePrediction[] = [];
  activeIndex: number = -1;
  options: { mode: "city" | "country" } = { mode: "city" };

  constructor(props: any) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  prepare(
    row: number,
    column: number,
    prop: string | number,
    TD: HTMLTableCellElement,
    originalValue: any,
    cellProperties: any,
  ) {
    super.prepare(row, column, prop, TD, originalValue, cellProperties);
    this.options = cellProperties?.placeOptions || this.options;
  }

  open() {
    super.open();

    if (!this.service) {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.warn("Google Maps Places API not available.");
        return;
      }
      this.service = new google.maps.places.AutocompleteService();
    }

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
      });
      document.body.appendChild(this.dropdown);
    }

    this.positionDropdown();
    this.dropdown.innerHTML = "";

    this.TEXTAREA.addEventListener("input", this.handleInput);
    this.TEXTAREA.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("click", this.handleOutsideClick);

    setTimeout(() => this.TEXTAREA.focus(), 0);
  }

  positionDropdown() {
    if (!this.dropdown || !this.TEXTAREA) return;
    const rect = this.TEXTAREA.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    this.dropdown.style.left = rect.left + scrollLeft + "px";
    this.dropdown.style.top = rect.bottom + scrollTop + "px";
    this.dropdown.style.width = rect.width + "px";
  }

  handleInput() {
    // const value = (this.TEXTAREA.value || "").trim();
    const textarea = this.TEXTAREA as HTMLTextAreaElement;
    const value = (textarea.value || "").trim();
    if (!value) {
      this.hideDropdown();
      return;
    }

    let request: google.maps.places.AutocompletionRequest = { input: value };

    if (this.options.mode === "city") {
      request.types = ["(cities)"];
    } else if (this.options.mode === "country") {
      request.types = ["(regions)"];
    }

    this.service?.getPlacePredictions(request, (predictions, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        predictions &&
        predictions.length
      ) {
        if (this.options.mode === "country") {
          this.suggestions = predictions.filter((p) =>
            p.types.includes("country"),
          );
        } else {
          this.suggestions = predictions;
        }
        this.renderDropdown(this.suggestions);
      } else {
        this.hideDropdown();
      }
    });
  }

  renderDropdown(predictions: google.maps.places.AutocompletePrediction[]) {
    if (!this.dropdown) return;
    this.dropdown.innerHTML = "";
    this.activeIndex = -1;

    predictions.forEach((p, idx) => {
      const item = document.createElement("div");
      item.textContent = p.description;
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
    const children = Array.from(this.dropdown.children) as HTMLDivElement[];
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
    const sanitized = this.sanitizePlaceName(p.description);
    this.setValue(sanitized);
    this.finishEditing(false);
    this.hideDropdown();
  }

  sanitizePlaceName(name: string) {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\x00-\x7F]/g, "")
      .trim();
  }

  handleKeyDown(e: KeyboardEvent) {
    if (!this.dropdown || !this.dropdown.childElementCount) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.setActive(
        Math.min(this.activeIndex + 1, this.dropdown.childElementCount - 1),
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this.setActive(Math.max(this.activeIndex - 1, 0));
    } else if (e.key === "Enter") {
      if (this.activeIndex >= 0) {
        e.preventDefault();
        this.selectSuggestion(this.activeIndex);
      } else {
        this.finishEditing(false);
        this.hideDropdown();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      this.hideDropdown();
    }
  }

  handleOutsideClick(evt: MouseEvent) {
    if (!this.dropdown) return;
    const path = (evt.composedPath?.() ||
      (evt as any).path ||
      []) as HTMLElement[];
    if (path.includes(this.dropdown) || path.includes(this.TEXTAREA)) return;
    this.hideDropdown();
  }

  hideDropdown() {
    if (this.dropdown) this.dropdown.innerHTML = "";
    this.suggestions = [];
    this.activeIndex = -1;
  }

  close() {
    super.close();
    this.hideDropdown();
    if (this.TEXTAREA) {
      this.TEXTAREA.removeEventListener("input", this.handleInput);
      this.TEXTAREA.removeEventListener("keydown", this.handleKeyDown);
    }
    document.removeEventListener("click", this.handleOutsideClick);
  }

  destroy() {
    if (this.dropdown) {
      try {
        document.body.removeChild(this.dropdown);
      } catch (e) {}
      this.dropdown = null;
    }
  }
}

export default CityAutocompleteEditor;
