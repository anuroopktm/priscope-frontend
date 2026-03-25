export const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Enabled", value: "enabled" },
  { label: "Disabled", value: "disabled" },
];

export const FREIGHT_RATE_ACTION_BAR_BUTTONS = {
  files: true,
  add: true,
  export: true,
  import: true,
  filter: true,
  comments: true,
  requests: true,
} as const;
