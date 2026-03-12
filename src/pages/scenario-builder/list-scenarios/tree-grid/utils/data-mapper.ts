import type { Scenario } from "@/services/queries/scenario-builder/scenario-builder.types";
import formatDate from "@/utils/formatDate";
import { renderActionsCell } from "../cells/actions.cell";
import { renderStatusBadge } from "../cells/status-badge.cell";

export const mapScenariosToGridRows = (scenarios: Scenario[] = []) => {
  return scenarios.map((s) => ({
    id: s.id,
    Name: s.created_by?.name || "N/A",
    createdAt: formatDate(s.created_at) || "N/A",
    // Email: s.created_by?.email || "N/A",
    Label: s.name || "N/A",
    Status: renderStatusBadge(s.status),
    Actions: renderActionsCell(String(s.id), s.status),
  }));
};

export const mapScenariosToGridBody = (scenarios: Scenario[] = []) => {
  return {
    Body: [mapScenariosToGridRows(scenarios)],
  };
};
