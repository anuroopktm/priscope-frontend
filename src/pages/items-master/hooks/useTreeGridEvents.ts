// import { useEffect } from "react";
// interface UseTreeGridEventsProps {
//   gridId: string;

//   onHandleScroll: (grid: TGrid, hpos: number, vpos: number) => void;

//   onSelected: (grid: TGrid) => void;

//   onHandleFilterChange: (grid: TGrid) => void;

//   onHandleValueChanged: (
//     grid: TGrid,
//     row: TRow,
//     col: string,
//     val: string,
//     oldval: string,
//   ) => void;
// }
// export const useTreeGridEvents = ({
//   gridId,
//   onHandleScroll,
//   onSelected,
//   onHandleFilterChange,
//   onHandleValueChanged,
// }: UseTreeGridEventsProps) => {
//   useEffect(() => {
//     window.TGSetEvent("OnScroll", gridId, onHandleScroll);
//     window.TGSetEvent("OnSelected", gridId, onSelected);
//     window.TGSetEvent("OnFilter", gridId, onHandleFilterChange);
//     window.TGSetEvent("OnValueChanged", gridId, onHandleValueChanged);

//     return () => {
//       window.TGDelEvent("OnSelected", gridId);
//       window.TGDelEvent("OnScroll", gridId);
//       window.TGDelEvent("OnFilter", gridId);
//       window.TGDelEvent("OnValueChanged", gridId);
//     };
//   }, []);
// };
