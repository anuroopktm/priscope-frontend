import { axiosInstance } from "@/services/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  CreateScenarioRequest,
  CreateScenarioResponse,
  SaveScenarioGridRequest,
  SaveScenarioGridResponse,
  ScenarioDetail,
  SearchScenariosRequest,
  SearchScenariosResponse,
} from "./scenario-builder.types";

export const useSaveScenarioGrid = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SaveScenarioGridResponse,
    AxiosError<{ detail: string | string[] }>,
    SaveScenarioGridRequest
  >({
    mutationKey: ["save-scenario-grid"],
    mutationFn: async ({ scenario_id, grid_data }) => {
      const { data } = await axiosInstance.put<SaveScenarioGridResponse>(
        `/v1/scenario-builder/scenarios/${scenario_id}/grid`,
        { grid_data },
      );
      return data;
    },
    onSuccess: (_, { scenario_id }) => {
      queryClient.invalidateQueries({
        queryKey: ["get-scenario", scenario_id],
      });
    },
  });
};

export const useCreateScenario = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateScenarioResponse,
    AxiosError<{ detail: string | string[] }>,
    CreateScenarioRequest
  >({
    mutationKey: ["create-scenario"],
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post<CreateScenarioResponse>(
        "/v1/scenario-builder/scenarios",
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-scenarios"],
        exact: false,
      });
    },
  });
};

export const useListScenarios = (payload: SearchScenariosRequest) => {
  return useQuery<
    SearchScenariosResponse,
    AxiosError<{ detail: string | string[] }>
  >({
    queryKey: ["list-scenarios", payload],
    queryFn: async () => {
      const { data } = await axiosInstance.post<SearchScenariosResponse>(
        "/v1/scenario-builder/scenarios/search",
        payload,
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });
};
export const useGetScenario = (scenarioId: string | undefined) => {
  return useQuery<ScenarioDetail, AxiosError<{ detail: string | string[] }>>({
    queryKey: ["get-scenario", scenarioId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ScenarioDetail>(
        `/v1/scenario-builder/scenarios/${scenarioId}`,
      );
      return data;
    },
    enabled: !!scenarioId,
    refetchOnWindowFocus: false,
  });
};
