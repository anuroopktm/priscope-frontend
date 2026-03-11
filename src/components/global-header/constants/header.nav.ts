import BookOpenIcon from "@/assets/global-header/book-open.svg?react";
import BuilderIcon from "@/assets/global-header/builder.svg?react";
import ItemsMasterIcon from "@/assets/global-header/package.svg?react";
import SupplierCardIcon from "@/assets/global-header/user-settings.svg?react";

export const   HEADER_NAV = [
  {
    type: "button",
    label: "Items Master",
    icon: ItemsMasterIcon,
    path: "/items-master",
  },
  {
    type: "select",
    label: "Rate Libraries",
    icon: BookOpenIcon,
    items: [
      {
        label: "Rate Libraries",
        path: "/rate-libraries",
      },
    ],
  },
  {
    type: "button",
    label: "Supplier Card",
    icon: SupplierCardIcon,
    path: "/supplier-card",
  },
  {
    type: "button",
    label: "Customer Card",
    icon: SupplierCardIcon,
    path: "/customer-card",
  },
  {
    type: "select",
    label: "Builder",
    icon: BuilderIcon,
    items: [
      { label: "Scenario Builder", path: "/scenario-builder" },
      { label: "Price List Builder", path: "/price-list-builder" },
      { label: "POS Builder", path: "/pos-builder" },
    ],
  },
] as const;
