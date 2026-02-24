import { MODULE_LABELS } from "../constants/file-modal.constants";
import { SimplifiedExport } from "../types/file-modal";
import formatDate from "../utils/formatDate";

export function mapExports(data: any[]): SimplifiedExport[] {
  return data.map((item) => {
    const createdAt = new Date(item.created_at);
    const moduleLabel =
      MODULE_LABELS[item.module_name] ?? item.module_name ?? "Unknown module";
    const formattedDate = createdAt.toLocaleDateString("en-GB");

    return {
      id: item.id,
      name: `${moduleLabel} - ${formattedDate}`,
      created_user_name: item.created_by?.users?.[0]?.name ?? "Unknown",
      created_time: createdAt.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      created_date: formatDate(item.created_at),
      status: item.status === "completed" ? "Success" : "Failed",
    };
  });
}
