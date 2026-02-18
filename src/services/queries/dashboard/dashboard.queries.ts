import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../api/axiosInstance";
import type { DashboardData } from "./dashboard.types";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
};

const fetchDashboardStats = async (): Promise<DashboardData> => {
  const { data } = await axiosInstance.get<DashboardData>("/dashboard/stats");
  return data;
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: fetchDashboardStats,
  });
};
