import deleteIcon from "@/assets/tree-grid/delete.svg";
import editIcon from "@/assets/tree-grid/edit.svg";

export const renderActionsCell = (id: string) => {
  return `<span style="display: inline-flex; gap: 8px; align-items: center; margin-left: 12px; vertical-align: middle; white-space: nowrap;">
    <button 
      style="background-color: transparent; border: none; cursor: pointer; padding: 2px; border-radius: 4px; transition: background-color 0.2s; display: flex; align-items: center; justify-content: center;"
      onmouseover="this.style.backgroundColor='#f0f0f0'"
      onmouseout="this.style.backgroundColor='transparent'"
      onclick="window.handleTreeGridEdit && window.handleTreeGridEdit('${id}')"
    >
      <img src="${editIcon}" alt="edit" style="width: 14px; height: 14px;" />
    </button>
    <button 
      style="background-color: transparent; border: none; cursor: pointer; padding: 2px; border-radius: 4px; transition: background-color 0.2s; display: flex; align-items: center; justify-content: center;"
      onmouseover="this.style.backgroundColor='#ffebee'"
      onmouseout="this.style.backgroundColor='transparent'"
      onclick="window.handleTreeGridDelete && window.handleTreeGridDelete('${id}')"
    >
      <img src="${deleteIcon}" alt="delete" style="width: 14px; height: 14px;" />
    </button>
  </span>`;
};
