//   export const handleRightClick = (
//     grid: TGrid,
//     row: TRow,
//     col: string,
//     gridId:string
//   ) => {
//     if (!grid || grid.id !== gridId || !props?.contextMenuItems?.length) {
//       return 0;
//     }

//     const items = props?.contextMenuItems
//       .filter((item) => !item.visible || item.visible(row))
//       .map((item) => ({
//         Name: item.name,
//         OnClick: () => item.onClick(grid, row, col),
//       }));

//     if (!items.length) return 0;

//     grid.ShowMenu(row, col, { Items: items });
//     return 1;
//   };