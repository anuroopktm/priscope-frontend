export type StatusType = "published" | "partially_published" | "draft";

interface StatusBadgeConfig {
  label: string;
  backgroundColor: string;
  textColor: string;
}

export const STATUS_BADGE_CONFIG: Record<StatusType, StatusBadgeConfig> = {
  published: {
    label: "Published",
    backgroundColor: "#1FC16B1A",
    textColor: "#147D46",
  },
  partially_published: {
    label: "Partially Published",
    backgroundColor: "#FFDB431A",
    textColor: "#8C7100",
  },
  draft: {
    label: "Draft",
    backgroundColor: "#1A2B441A",
    textColor: "#144E72",
  },
};
