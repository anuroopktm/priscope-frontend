import type { Scenario } from "@/services/queries/scenario-builder/scenario-builder.types";
import { renderActionsCell } from "../cells/actions.cell";
import { renderStatusBadge } from "../cells/status-badge.cell";

export const mapScenariosToGridRows = (scenarios: Scenario[] = []) => {
  return scenarios.map((s) => ({
    id: s.id,
    SKU: s.name,
    UPC: s.id.slice(0, 8).toUpperCase(),
    Description: s.sync_status || "N/A",
    Supplier: s.created_by?.name || "N/A",
    Customer: "N/A",
    Status: renderStatusBadge(s.status),
    Actions: renderActionsCell(),
  }));
};

export const mapScenariosToGridBody = (scenarios: Scenario[] = []) => {
  return {
    Body: [mapScenariosToGridRows(scenarios)],
  };
};
