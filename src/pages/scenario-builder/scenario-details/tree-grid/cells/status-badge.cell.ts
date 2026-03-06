import {
  STATUS_BADGE_CONFIG,
  type StatusType,
} from "../../constants/status-badge.constants";

export const renderStatusBadge = (status: string) => {
  const normalizedStatus = status?.toLowerCase() as StatusType;
  const config =
    STATUS_BADGE_CONFIG[normalizedStatus] || STATUS_BADGE_CONFIG.draft;

  return `<span style="display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 10px; font-size: 12px; font-weight: 600; background-color: ${config.backgroundColor}; color: ${config.textColor}; white-space: nowrap;">${config.label}</span>`;
};
