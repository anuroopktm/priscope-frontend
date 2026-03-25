import {
  ADMIN_REQUEST_ACTIONS,
  ADMIN_REQUEST_MODULES,
} from "@/constants/admin-request.contants";
import { FREIGHT_RATE_HEADERS } from "../constants/tableHeaders.constants";
import {
  buildStatusUpdate,
  createFreightRateRequestBody,
  getContainerTypeIdByType,
  getFieldNameByCol,
} from "./freightRateHelpers";
import {
  createAddAdminRequestPayload,
  createAdminRequestPayload,
} from "./type";

// type SnackbarSetter = (args: {
//   message: string;
//   severity: "success" | "error" | "info" | "warning";
// }) => void;

type MutationHandler<TData = any, TVariables = any> = {
  mutateAsync: (variables: TVariables) => Promise<TData>;
  mutate?: (
    variables: TVariables,
    options?: {
      onSuccess?: (res: TData) => void;
      onError?: (err: any) => void;
    },
  ) => void;
};

type AdminRequestPayload = Record<string, any>;

type CreateAdminRequestFn = (
  payload: AdminRequestPayload,
  options: { onSuccess?: (res: any) => void; onError?: (err: any) => void },
) => void;

// type CreateExportFn = (
//   payload: Record<string, any>,
//   options: { onSuccess?: () => void; onError?: () => void },
// ) => void;

type FreightRate = {
  id: string;
  rate: number;
  currency: string;
  valid_to: string;
  port_of_origin: string;
  port_of_destination: string;
  [key: string]: any;
};

type ContainerType = { id: string; label: string; [key: string]: any };

export const enableDisabelRequestHandler = ({
  comment,
  createAdminRequest,
  setRequestSuccessNotficationVisible,
  showToast,
  setAction,
  // t,
  values,
  selectedRows,
  action,
  containerTypesData,
}: {
  comment: string;
  createAdminRequest: CreateAdminRequestFn;
  setRequestSuccessNotficationVisible: (visible: boolean) => void;
  showToast: (message: string, severity: "success" | "error") => void;
  setAction: (action: string) => void;
  // t: TranslationFn;
  values: any[];
  selectedRows: any;
  action: string;
  containerTypesData: any;
}) => {
  const requestInfo = buildStatusUpdate(
    values,
    selectedRows,
    action,
    containerTypesData?.container_types,
  );
  const adminRequestPayload = {
    source_module: ADMIN_REQUEST_MODULES.FREIGHT_RATE,
    target_module: ADMIN_REQUEST_MODULES.FREIGHT_RATE,
    request_action: ADMIN_REQUEST_ACTIONS.BULK_STATUS_UPDATE,
    request_comments: comment,
    request_info: requestInfo,
  };
  createAdminRequest(adminRequestPayload, {
    onSuccess: () => {
      setRequestSuccessNotficationVisible(true);
      setAction("");
    },
    onError: () => {
      showToast("Admin request failed", "error");
      setAction("");
    },
  });
};

export function exportAllFreightRates({
  allData,
  showToast,
  createExport,
  // t,
}: {
  allData: FreightRate[];
  showToast: (message: string, severity: "success" | "error") => void;
  createExport: any;
  // t: TranslationFn;
}) {
  const ids = allData.map((row) => row.id);
  if (ids.length === 0) {
    showToast("No rows for export", "error");
    return;
  }

  const payload = {
    module_name: "freight_rate",
    feature_name: "main",
    file_type: "csv",
    parameters: { ids, filter: {}, options: {} },
  };

  createExport(payload, {
    onSuccess: () => {
      showToast(
        `Exported ${ids.length} freight rate(s) successfully`,
        "success",
      );
    },
    onError: () => {
      showToast("Export failed. Please try again.", "error");
    },
  });
}

export function exportSelectedFreightRates({
  selectedRows,
  showToast,
  createExport,
  setSelectedRows,
  // t,
}: {
  selectedRows: Record<string, boolean>;
  showToast: (message: string, severity: "success" | "error") => void;
  createExport: any;
  setSelectedRows: (rows: Record<string, boolean>) => void;
  // t: TranslationFn;
}) {
  const ids = Object.keys(selectedRows).filter((id) => selectedRows[id]);
  if (ids.length === 0) {
    showToast("No rows selected for export", "error");
    return;
  }

  const payload = {
    module_name: "freight_rate",
    feature_name: "main",
    file_type: "csv",
    parameters: { ids, filter: {}, options: {} },
  };

  createExport(payload, {
    onSuccess: () => {
      showToast(
        `Exported ${ids.length} freight rate(s) successfully`,
        "success",
      );
      setSelectedRows({});
    },
    onError: () => {
      showToast("Export failed", "error");
      setSelectedRows({});
    },
  });
}

export async function freightRateBulkStatusUpdate({
  status,
  selectedRows,
  showToast,
  bulkStatusUpdateMutation,
  tenantId,
  setSelectedRows,
  refetch,
  setSkip,
  skip,
  // t,
}: {
  status: "active" | "inactive";
  selectedRows: Record<string, boolean>;
  showToast: (message: string, severity: "success" | "error") => void;
  bulkStatusUpdateMutation: MutationHandler<{ processed_count: number }, any>;
  tenantId: string;
  setSelectedRows: (rows: Record<string, boolean>) => void;
  refetch: () => void;
  setSkip: any;
  skip: number;
  // t: TranslationFn;
}) {
  const selectedFreightRateIds = Object.keys(selectedRows).filter(
    (id) => selectedRows[id],
  );

  if (selectedFreightRateIds.length === 0) {
    showToast("No rows selected", "error");
    return;
  }

  try {
    const result = await bulkStatusUpdateMutation.mutateAsync({
      action_key: "status",
      ids: selectedFreightRateIds,
      source: "freight_rate",
      status,
      tenant_id: tenantId,
    });

    showToast(
      `Successfully ${status === "active" ? "enabled" : "disabled"} ${
        result.processed_count
      } freight rate(s)`,
      "success",
    );

    setSelectedRows({});
    if (skip !== 0) {
      setSkip(0);
      return;
    }
    refetch();
  } catch (error: any) {
    showToast(
      status === "active" ? "Bulk enable failed" : "Bulk disable failed",
      "error",
    );
  }
}

export function editFreightRate({
  editingCell,
  data,
  comment,
  allData,
  hasEditFreightRatePrivilege,
  containerTypesData,
  createAdminRequest,
  setRequestSuccessNotficationVisible,
  showToast,
  values,
  tenantId,
  updateFreightRate,
  // t,
}: {
  editingCell: { row: number; col: number };
  data: any[];
  comment: string;
  allData: FreightRate[];
  hasEditFreightRatePrivilege: boolean;
  containerTypesData: any;
  createAdminRequest: CreateAdminRequestFn;
  setRequestSuccessNotficationVisible: (visible: boolean) => void;
  showToast: (message: string, severity: "success" | "error") => void;
  values: any[];
  tenantId: string;
  updateFreightRate: any;
  // t: TranslationFn;
}) {
  const { row, col } = editingCell;
  const freightRateId = data[8] || allData[row].id;
  if (!hasEditFreightRatePrivilege) {
    const containerTypeId = getContainerTypeIdByType(
      containerTypesData?.container_types,
      data[2],
    );
    const oldRate = allData.find((rate) => rate.id === freightRateId);
    const oldRecord = {
      rate: oldRate?.rate,
      currency: oldRate?.currency,
      valid_to: oldRate?.valid_to,
      port_of_origin: oldRate?.port_of_origin,
      container_type_id: containerTypeId,
      port_of_destination: oldRate?.port_of_destination,
    };
    const newRecord = {
      port_of_origin: data[0],
      port_of_destination: data[1],
      container_type_id: containerTypeId,
      currency: data[3],
      rate: data[4],
      valid_to: data[5],
    };
    const requestInfo = [{ new_record: newRecord, old_record: oldRecord }];
    const editRequestPayload = createAdminRequestPayload(
      ADMIN_REQUEST_MODULES.FREIGHT_RATE,
      freightRateId,
      ADMIN_REQUEST_MODULES.FREIGHT_RATE,
      freightRateId,
      comment,
      ADMIN_REQUEST_ACTIONS.UPDATE,
      requestInfo,
    );
    createAdminRequest(editRequestPayload, {
      onSuccess: () => {
        setRequestSuccessNotficationVisible(true);
      },
      onError: () => {
        showToast("Admin request failed", "error");
      },
    });
    const value = values.find((val) => val[8] === freightRateId);
    value[3] = oldRate?.currency;
    value[4] = oldRate?.rate;
    value[5] = oldRate?.valid_to.split("T")[0];
    return;
  }
  const fieldKey = getFieldNameByCol(col);
  const fieldValue = data[col];
  const updatedFields = { [fieldKey]: fieldValue };
  if (fieldKey === "rate") {
    updatedFields.currency = data[col - 1];
  }

  const basePayload: any = {
    tenantId,
    updatedFields,
    freightRateId,
    comments: [],
  };

  // Add comment only if it's non-empty
  if (comment && comment.trim() !== "") {
    basePayload.comments = [{ comment, fieldKey }];
  }

  const payload = createFreightRateRequestBody(basePayload);

  updateFreightRate(
    { payload, freightRateId },
    {
      onSuccess: () => {
        showToast("Freight rate updated successfully", "success");
      },
      onError: () => {
        showToast("Failed to update freight rate", "error");
      },
    },
  );
}

export function addNewFreightRate({
  localData,
  rowIndex,
  showToast,
  setFailedRows,
  setLoadingRows,
  hotRef,
  containerTypeOptions,
  hasAddFreightRatePrivilege,
  createAdminRequest,
  setRequestSuccessNotficationVisible,
  setLocalData,
  comment,
  tenantId,
  setAllData,
  handleSnackBarClose,
  setAddRowInprogress,
  createFreightRate,
  // t,
}: {
  localData: any[][];
  rowIndex: number;
  showToast: (message: string, severity: "success" | "error") => void;
  setFailedRows: React.Dispatch<React.SetStateAction<Set<number>>>;
  setLoadingRows: React.Dispatch<React.SetStateAction<Set<number>>>;
  hotRef: React.MutableRefObject<any>;
  containerTypeOptions: ContainerType[];
  hasAddFreightRatePrivilege: boolean;
  createAdminRequest: CreateAdminRequestFn;
  setRequestSuccessNotficationVisible: (visible: boolean) => void;
  setLocalData: React.Dispatch<React.SetStateAction<any[][]>>;
  comment: string;
  tenantId: string;
  setAllData: React.Dispatch<React.SetStateAction<FreightRate[]>>;
  handleSnackBarClose: () => void;
  setAddRowInprogress: (value: boolean) => void;
  createFreightRate: any;
  // t: TranslationFn;
}) {
  const row = localData[rowIndex];

  // Mandatory fields check
  const requiredFields = [
    { key: "Port of Origin", value: row[0] },
    { key: "Port of Destination", value: row[1] },
    { key: "Container Type", value: row[2] },
    { key: "Currency", value: row[3] },
    { key: "Rate", value: row[4] },
    { key: "Valid Until", value: row[5] },
  ];

  const missing = requiredFields.filter(
    (field) => !field.value || field.value.toString().trim() === "",
  );

  if (missing.length > 0) {
    showToast(
      `Please fill required fields: ${missing.map((f) => f.key).join(", ")}`,
      "error",
    );

    setFailedRows((prev) => new Set([...prev, rowIndex]));
    setLoadingRows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(rowIndex);
      return newSet;
    });

    // Highlight missing cells in the row
    const hot = hotRef.current?.hotInstance;
    if (hot) {
      missing.forEach((field) => {
        const colIndex = requiredFields.findIndex((f) => f.key === field.key);
        hot.setCellMeta(rowIndex, colIndex, "className", "invalid-cell");
      });
      hot.render();
    }

    return;
  }

  // find container_type_id by matching label
  const selectedType = containerTypeOptions.find((ct) => ct.label === row[2]);

  if (!hasAddFreightRatePrivilege) {
    const newRecord = {
      port_of_origin: row[0],
      port_of_destination: row[1],
      container_type_id: selectedType?.id || " ",
      currency: row[3],
      rate: row[4],
      valid_to: row[5],
    };
    const requestInfo = [{ new_record: newRecord }];
    const addRequestPayload = createAddAdminRequestPayload(
      ADMIN_REQUEST_MODULES.FREIGHT_RATE,
      ADMIN_REQUEST_MODULES.FREIGHT_RATE,
      comment,
      ADMIN_REQUEST_ACTIONS.INSERT,
      requestInfo,
    );
    createAdminRequest(addRequestPayload, {
      onSuccess: () => {
        setRequestSuccessNotficationVisible(true);
        setLocalData((prev) => prev.filter((_, index) => index !== rowIndex));
        setAddRowInprogress(false);
      },
      onError: () => {
        showToast("Admin request failed", "error");
        setAddRowInprogress(true);
      },
    });
    return;
  }

  const payload: any = {
    container_type_id: selectedType?.id || " ",
    currency: row[3],
    port_of_origin: row[0],
    port_of_destination: row[1],
    rate: row[4] ? Number(row[4]) : 0,
    source: "freight_rate",
    tenant_id: tenantId,
    valid_to: row[5],
  };

  // Add comments only if present
  if (comment && comment.trim() !== "") {
    payload.action_key = "curr_rate";
    payload.comments = [
      {
        comment,
        comment_type: "row",
      },
    ];
  }

  setLoadingRows((prev) => new Set([...prev, rowIndex]));
  createFreightRate(payload, {
    onSuccess: (res: any) => {
      res.container_type = selectedType?.label || "";
      setAllData((prev) => [res, ...prev]);
      setLocalData((prev) => prev.filter((_, index) => index !== rowIndex));
      setFailedRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(rowIndex);
        return newSet;
      });
      setLoadingRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(rowIndex);
        return newSet;
      });
      handleSnackBarClose();
      setAddRowInprogress(false);
    },
    onError: (err: any) => {
      console.error("Error creating freight rate:", err);
      const message =
        err.body.detail[0].msg ||
        err.body.detail ||
        "Failed to create freight rate";
      showToast(message, "error");
      setFailedRows((prev) => new Set([...prev, rowIndex]));
      setLoadingRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(rowIndex);
        return newSet;
      });
      setAddRowInprogress(true);
    },
  });
}

export function cancelFreightRateAdd({
  setLocalData,
  setFailedRows,
  setLoadingRows,
  rowIndex,
}: {
  setLocalData: React.Dispatch<React.SetStateAction<any[][]>>;
  setFailedRows: React.Dispatch<React.SetStateAction<Set<number>>>;
  setLoadingRows: React.Dispatch<React.SetStateAction<Set<number>>>;
  rowIndex: number;
}) {
  setLocalData((prev) => prev.filter((_, index) => index !== rowIndex));
  setFailedRows((prev) => {
    const newSet = new Set(prev);
    newSet.delete(rowIndex);
    return newSet;
  });
  setLoadingRows((prev) => {
    const newSet = new Set(prev);
    newSet.delete(rowIndex);
    return newSet;
  });
}

export function addEmptyFreightRateRow({
  setIsAddingRow,
  setLocalData,
}: {
  setIsAddingRow: (value: boolean) => void;
  setLocalData: React.Dispatch<React.SetStateAction<any[][]>>;
}) {
  setIsAddingRow(true);
  setTimeout(() => {
    setLocalData((prev) => [
      Array(FREIGHT_RATE_HEADERS.length).fill(""),
      ...prev,
    ]);
    setIsAddingRow(false);
  }, 500);
}

export function handleCommentSelect(
  commentData: {
    comment_type: string;
    freight_rate_id: string | null;
    freight_field_key?: string;
  },
  setHighlightTarget: (target: {
    freightRateId: string | null;
    fieldKey?: string;
  }) => void,
) {
  if (commentData.comment_type === "row") {
    setHighlightTarget({
      freightRateId: commentData.freight_rate_id,
    });
  } else if (commentData.comment_type === "field") {
    setHighlightTarget({
      freightRateId: commentData.freight_rate_id,
      fieldKey: commentData.freight_field_key,
    });
  } else {
    setHighlightTarget({ freightRateId: null });
  }
}

type AddCommentParams = {
  editingCell: any; // if undefined → row comment
  data: any[]; // current row data
  allData: any[]; // all table data
  comment: string;
  tenantId: string;
  createComment: (payload: any) => Promise<any>; // API call function
  // t: (namespace: string, key: string) => string;
  showToast: (message: string, severity: "success" | "error") => void;
};

export function addComment({
  editingCell,
  data,
  allData,
  comment,
  tenantId,
  createComment,
  // t,
  showToast,
}: AddCommentParams) {
  if (!comment?.trim()) return;
  const { row, col } = editingCell;
  const freightRateId = data[8] || allData[row].id;
  // Determine freightRateId for the row
  const id = freightRateId || data[8] || allData[row]?.id;
  if (!id) return;

  // Build comments array for payload
  const comments =
    col !== undefined
      ? [{ comment_type: "field", field_key: getFieldNameByCol(col), comment }]
      : [{ comment_type: "row", comment }];

  const payload = {
    tenant_id: tenantId,
    comments,
    source: "freight_rate",
    action_key: col !== undefined ? getFieldNameByCol(col) : undefined,
  };

  try {
    createComment({ freightRateId, payload });
    showToast("Comment added successfully", "success");
  } catch (err: any) {
    showToast("Failed to add comment", "error");
  }
}
