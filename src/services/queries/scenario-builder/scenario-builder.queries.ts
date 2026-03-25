import { axiosInstance } from "@/services/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  CreateScenarioCommentRequest,
  CreateScenarioRequest,
  CreateScenarioResponse,
  DuplicateScenarioRequest,
  DuplicateScenarioResponse,
  PartialPublishScenarioRequest,
  PublishScenarioResponse,
  SaveScenarioGridRequest,
  SaveScenarioGridResponse,
  ScenarioActivityListResponse,
  ScenarioComment,
  ScenarioCommentListResponse,
  ScenarioDetail,
  SearchScenarioActivityRequest,
  SearchScenarioCommentsRequest,
  SearchScenariosRequest,
  SearchScenariosResponse,
  CreateScenarioAggregatorRequest,
  ScenarioAggregatorResponse,
} from "./scenario-builder.types";

export const useCreateScenarioComment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ScenarioComment,
    AxiosError<{ detail: string | string[] }>,
    { scenario_id: string; payload: CreateScenarioCommentRequest }
  >({
    mutationKey: ["create-scenario-comment"],
    mutationFn: async ({ scenario_id, payload }) => {
      const { data } = await axiosInstance.post<ScenarioComment>(
        `/v1/scenario-builder/scenarios/${scenario_id}/comments`,
        payload,
      );
      return data;
    },
    onSuccess: (_, { scenario_id }) => {
      // Invalidate get-scenario to potentially show indicators if they come from there
      queryClient.invalidateQueries({
        queryKey: ["get-scenario", scenario_id],
      });
      // Invalidate comments list
      queryClient.invalidateQueries({
        queryKey: ["list-scenario-comments", scenario_id],
      });
    },
  });
};

export const useListScenarioComments = (
  scenarioId: string | undefined,
  payload: SearchScenarioCommentsRequest,
) => {
  return useQuery<
    ScenarioCommentListResponse,
    AxiosError<{ detail: string | string[] }>
  >({
    queryKey: ["list-scenario-comments", scenarioId, payload],
    queryFn: async () => {
      const { data } = await axiosInstance.post<ScenarioCommentListResponse>(
        `/v1/scenario-builder/scenarios/${scenarioId}/comments/list`,
        payload,
      );
      return data;
    },
    enabled: !!scenarioId,
    refetchOnWindowFocus: false,
  });
};

export const usePublishScenario = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PublishScenarioResponse,
    AxiosError<{ detail: string | string[] }>,
    string
  >({
    mutationKey: ["publish-scenario"],
    mutationFn: async (scenarioId) => {
      const { data } = await axiosInstance.post<PublishScenarioResponse>(
        `/v1/scenario-builder/scenarios/${scenarioId}/publish`,
      );
      return data;
    },
    onSuccess: (_, scenarioId) => {
      queryClient.invalidateQueries({
        queryKey: ["get-scenario", scenarioId],
      });
      queryClient.refetchQueries({
        queryKey: ["list-scenarios"],
        exact: false,
      });
    },
  });
};

export const usePartialPublishScenario = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PublishScenarioResponse,
    AxiosError<{ detail: string | string[] }>,
    PartialPublishScenarioRequest
  >({
    mutationKey: ["partial-publish-scenario"],
    mutationFn: async ({ scenario_id, item_ids, group_ids }) => {
      const payload: any = {};
      const cleanItemIds = (item_ids || []).filter(
        (id) => id && id.trim() !== "",
      );
      const cleanGroupIds = (group_ids || []).filter(
        (id) => id && id.trim() !== "",
      );

      if (cleanItemIds.length > 0) payload.item_ids = cleanItemIds;
      if (cleanGroupIds.length > 0) payload.group_ids = cleanGroupIds;

      const { data } = await axiosInstance.post<PublishScenarioResponse>(
        `/v1/scenario-builder/scenarios/${scenario_id}/publish/partial`,
        payload,
      );
      return data;
    },
    onSuccess: (_, { scenario_id }) => {
      queryClient.invalidateQueries({
        queryKey: ["get-scenario", scenario_id],
      });
      queryClient.refetchQueries({
        queryKey: ["list-scenarios"],
        exact: false,
      });
    },
  });
};

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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-scenarios"],
        exact: false,
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
    refetchOnWindowFocus: false,
  });
};

export const useDeleteScenario = () => {
  const queryClient = useQueryClient();

  return useMutation<string, AxiosError<{ detail: string | string[] }>, string>(
    {
      mutationKey: ["delete-scenario"],
      mutationFn: async (scenarioId) => {
        const { data } = await axiosInstance.delete<string>(
          `/v1/scenario-builder/scenarios/${scenarioId}`,
        );
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["list-scenarios"],
          exact: false,
        });
      },
    },
  );
};

export const useDuplicateScenario = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DuplicateScenarioResponse,
    AxiosError<{ detail: string | string[] }>,
    DuplicateScenarioRequest
  >({
    mutationKey: ["duplicate-scenario"],
    mutationFn: async ({ scenario_id, name }) => {
      const { data } = await axiosInstance.post<DuplicateScenarioResponse>(
        `/v1/scenario-builder/scenarios/${scenario_id}/fork`,
        { name },
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

export const useListScenarioActivity = (
  scenarioId: string | undefined,
  payload: SearchScenarioActivityRequest,
) => {
  return useQuery<
    ScenarioActivityListResponse,
    AxiosError<{ detail: string | string[] }>
  >({
    queryKey: ["list-scenario-activity", scenarioId, payload],
    queryFn: async () => {
      const { data } = await axiosInstance.post<ScenarioActivityListResponse>(
        `/v1/scenario-builder/scenarios/${scenarioId}/activity`,
        payload,
      );
      return data;
    },
    enabled: !!scenarioId,
    refetchOnWindowFocus: false,
  });
};

export const useCreateScenarioAggregator = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ScenarioAggregatorResponse,
    AxiosError<{ detail: string | string[] }>,
    { scenario_id: string; payload: CreateScenarioAggregatorRequest }
  >({
    mutationKey: ["create-scenario-aggregator"],
    mutationFn: async ({ scenario_id, payload }) => {
      const { data } = await axiosInstance.post<ScenarioAggregatorResponse>(
        `/v1/scenario-builder/scenarios/${scenario_id}/aggregators`,
        payload,
      );
      return data;
    },
    onSuccess: (_, { scenario_id }) => {
      queryClient.invalidateQueries({
        queryKey: ["get-scenario-aggregator", scenario_id],
      });
    },
  });
};

export const useGetScenarioAggregator = (
  scenarioId: string | undefined,
  cellId: string | undefined,
) => {
  return useQuery<
    ScenarioAggregatorResponse,
    AxiosError<{ detail: string | string[] }>
  >({
    queryKey: ["get-scenario-aggregator", scenarioId, cellId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ScenarioAggregatorResponse>(
        `/v1/scenario-builder/scenarios/${scenarioId}/aggregators`,
        {
          params: {
            scenario_id: scenarioId,
            cell_id: cellId,
          },
        },
      );
      return data;
    },
    enabled: !!scenarioId && !!cellId,
    refetchOnWindowFocus: false,
  });
};
