// import add from "@/assets/actions/plus-sign.svg";
import uploadcsv from "@/assets/actions/upload-03.svg";
import databaseImport from "@/assets/actions/crown-03.svg";
// import plus from "@/assets/actions/plus-sign-circle.svg";
import refresh from "@/assets/actions/refresh.svg";
import upload from "@/assets/actions/upload-circle-01.svg";
import type { CardConfig } from "./actionCard";

export const CARD_CONFIGS: readonly CardConfig[] = [
  {
    id: "erp-sync",
    title: (
      <>
        Connect and Sync
        <br />
        with your <strong>ERP</strong>
      </>
    ),
    buttonText: "Sync ERP",
    icon: (
      <img src={databaseImport} alt="Database import" width={20} height={20} />
    ),
    image: refresh,
    imageAlt: "ERP import",
    imageStyle: { width: "100px", height: "auto" },
  },
  {
    id: "csv-upload",
    title: (
      <>
        Upload and map
        <br />
        your <strong>CSV/Excel</strong> file
      </>
    ),
    buttonText: "Upload file",
    icon: <img src={uploadcsv} alt="Upload CSV" width={20} height={20} />,
    image: upload,
    imageAlt: "Upload csv",
    imageStyle: { width: "130px", height: "auto" },
  }
  // {
  //   id: "manual-add",
  //   title: (
  //     <>
  //       Add your item <br />
  //       <strong>Manually</strong>
  //     </>
  //   ),
  //   buttonText: "Add Item",
  //   icon: <img src={add} alt="plus sign" width={20} height={20} />,
  //   image: plus,
  //   imageAlt: "Add item icon",
  //   imageStyle: { width: "100px", height: "auto" },
  // },
] as const;
