export type StatusType = "published" | "partially_published" | "draft";

interface StatusBadgeConfig {
  label: string;
  backgroundColor: string;
  textColor: string;
}

export const STATUS_BADGE_CONFIG: Record<StatusType, StatusBadgeConfig> = {
  published: {
    label: "Published",
    backgroundColor: "#E6F4EA",
    textColor: "#107548",
  },
  partially_published: {
    label: "Partially Published",
    backgroundColor: "#FEF7E0",
    textColor: "#B05A00",
  },
  draft: {
    label: "Draft",
    backgroundColor: "#E8EEF3",
    textColor: "#1F3E5A",
  },
};
