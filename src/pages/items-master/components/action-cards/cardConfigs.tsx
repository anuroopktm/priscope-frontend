// // import Image from "next/image";
// import databaseImport from "../../assets/import.svg";
// import uploadcsv from "../../assets/csv-upload.svg";
// import plus from "../../assets/plus-sign.svg";
// import refresh from "../../assets/refresh.svg";
// import upload from "../../assets/upload-circle.svg";
// import add from "../../assets/add-item.svg";
// import type { CardConfig } from "./actionCard";

// export const CARD_CONFIGS: readonly CardConfig[] = [
//   {
//     id: "erp-sync",
//     title: (
//       <>
//         Connect and Sync
//         <br />
//         with your <strong>ERP</strong>
//       </>
//     ),
//     buttonText: "Sync ERP",
//     icon: (
//       <Image
//         src={databaseImport}
//         alt="Database import"
//         width={20}
//         height={20}
//       />
//     ),
//     image: refresh,
//     imageAlt: "ERP import",
//     imageStyle: { width: "100px", height: "auto" },
//   },
//   {
//     id: "csv-upload",
//     title: (
//       <>
//         Upload and map
//         <br />
//         your <strong>CSV/Excel</strong> file
//       </>
//     ),
//     buttonText: "Upload file",
//     icon: <img src={uploadcsv} alt="Upload CSV" width={20} height={20} />,
//     image: upload,
//     imageAlt: "Upload csv",
//     imageStyle: { width: "130px", height: "auto" },
//   },
//   {
//     id: "manual-add",
//     title: (
//       <>
//         Add your item <br />
//         <strong>Manually</strong>
//       </>
//     ),
//     buttonText: "Add Item",
//     icon: <img src={plus} alt="plus sign" width={20} height={20} />,
//     image: add,
//     imageAlt: "Add item icon",
//     imageStyle: { width: "100px", height: "auto" },
//   },
// ] as const;
