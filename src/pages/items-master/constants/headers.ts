import type { TreeGridHeader } from "../helpers/types";

export const HEADERS = {
    "headers": [
        {
            "id": "id",
            "label": "Id",
            "data_type": "string",
        },
        {
            "id": "sku",
            "label": "SKU",
            "data_type": "string",
        },
        {
            "id": "description",
            "label": "Description",
            "data_type": "string",
        },
        {
            "id": "upc",
            "label": "UPC",
            "data_type": "string",
        },
        {
            "id": "category",
            "label": "Category",
            "data_type": "string",
        },
        {
            "id": "hs_code",
            "label": "HS Code",
            "data_type": "string",
        },
        {
            "id": "Size",
            "label": "Size",
            "data_type": "string",
        },
        {
            "id": "Color",
            "label": "Color",
            "data_type": "string",
        },
        {
            "id": "Customer Cost",
            "label": "Customer Cost",
            "data_type": "number",
        },
        {
            "id": "Customer Cost Currency",
            "label": "Customer Cost Currency",
            "data_type": "string",
        },
        {
            "id": "Supplier Cost",
            "label": "Supplier Cost",
            "data_type": "number",
        },
        {
            "id": "Supplier Cost Currency",
            "label": "Supplier Cost Currency",
            "data_type": "string",
        }
    ],
    "total_count": 10
}


export const extraCols: TreeGridHeader[] = [
    {
        Name: "Supplier",
        Type: "Text",
        RelWidth: 1,
        CanEdit: 0,
        Visible: 0
    },
    {
        Name: "Customer",
        Type: "Text",
        RelWidth: 1,
        CanEdit: 0,
        Visible: 0
    },
];