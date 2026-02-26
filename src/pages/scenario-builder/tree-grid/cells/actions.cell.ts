export const renderActionsCell = (id: string) => {
  return `<div style="display: flex; gap: 12px; align-items: center; justify-content: center;">
    <button 
      style="background-color: transparent; border: none; cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s;"
      onmouseover="this.style.backgroundColor='#f0f0f0'"
      onmouseout="this.style.backgroundColor='transparent'"
      onclick="console.log('Edit clicked for ${id}')"
    >
      <img src="src/assets/tree-grid/edit.svg" alt="edit" style="width: 16px; height: 16px;" />
    </button>
    <button 
      style="background-color: transparent; border: none; cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s;"
      onmouseover="this.style.backgroundColor='#ffebee'"
      onmouseout="this.style.backgroundColor='transparent'"
      onclick="window.handleTreeGridDelete && window.handleTreeGridDelete('${id}')"
    >
      <img src="src/assets/tree-grid/delete.svg" alt="delete" style="width: 16px; height: 16px;" />
    </button>
  </div>`;
};
