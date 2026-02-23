export const getRequestTitle = (item: any) => {
  const action = item.request_action;

  if (action === "insert") {
    return "Add new rate";
  }

  if (action === "update") {
    return "Edit rate";
  }

  if (action === "bulk_status_change") {
    const status = item.request_info?.[0]?.new_record?.status;
    if (status === "inactive") {
      return "Disable data";
    }
    if (status === "active") {
      return "Enable data";
    }
  }
};
