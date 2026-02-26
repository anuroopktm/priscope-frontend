import { axiosInstance } from "@/services/api/axiosInstance";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  ListItemsResponse,
  ListRequestBody,
  ListTemplateHeadersRequest,
  ListTemplateHeadersResponse,
  ListTemplatesResponse,
  MapFieldsRequest,
  MapFieldsResponse,
  SystemFieldsResponse,
} from "./item-master-refactor.types";

export type UploadResponse = {
  upload_id: string;
  url: string;
  message: string;
};

export const useUploadItemMasterFile = () => {
  return useMutation<
    UploadResponse,
    AxiosError<{ detail: string | string[] }>,
    { file: File }
  >({
    mutationFn: async ({ file }) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post<UploadResponse>(
        `/v1/common/upload?feature=item_master`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
        },
      );

      return response.data;
    },
  });
};

export const useMapItemMasterFields = () => {
  return useMutation<
    MapFieldsResponse,
    AxiosError,
    MapFieldsRequest & { upload_id: string; update_if_exists: boolean }
  >({
    mutationFn: async ({ payload, upload_id, update_if_exists }) => {
      const response = await axiosInstance.post<MapFieldsResponse>(
        `/v1/item-master/${upload_id}/map-fields?update_if_exists=${update_if_exists}`,
        payload,
        { timeout: 60000 },
      );
      return response.data;
    },
  });
};

export const useListSystemFields = () => {
  return useMutation<SystemFieldsResponse, AxiosError, any>({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post<SystemFieldsResponse>(
        `/v1/item-master/system-fields/search`,
        payload,
        { timeout: 60000 },
      );
      return response.data;
    },
  });
};

export const useListTemplates = () => {
  return useInfiniteQuery({
    queryKey: ["templates"],
    queryFn: async ({ pageParam = 0 }) => {
      const payload: ListRequestBody = {
        search: "",
        page_size: 50,
        skip: pageParam,
      };

      const response = await axiosInstance.post<ListTemplatesResponse>(
        `/v1/item-master/templates/search`,
        payload,
      );

      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((p) => p.templates).length;
      const totalAvailable = lastPage.total ?? 0;
      return totalFetched < totalAvailable ? totalFetched : undefined;
    },
    staleTime: 1000 * 60 * 5,
    initialPageParam: 0,
  });
};

export const useListTemplateHeaders = () => {
  return useMutation<
    ListTemplateHeadersResponse,
    AxiosError,
    ListTemplateHeadersRequest & { template_id: string }
  >({
    mutationFn: async ({ payload, template_id }) => {
      const response = await axiosInstance.post<ListTemplateHeadersResponse>(
        `/v1/item-master/templates/${template_id}/headers`,
        payload,
        { timeout: 60000 },
      );
      return response.data;
    },
  });
};

export const useListItems = (payload: Omit<ListRequestBody, "skip">) => {
  return useInfiniteQuery({
    queryKey: ["listItems", payload.search, payload.filter],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await axiosInstance.post<ListItemsResponse>(
        `/v1/item-master/items/search_v2`,
        {
          search: payload.search ?? "",
          page_size: payload.page_size ?? 100,
          skip: pageParam,
          filters: payload.filter,
        },
      );
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (acc, page) => acc + page.items.length,
        0,
      );
      return lastPage.items.length < (payload.page_size ?? 100)
        ? undefined
        : totalFetched;
    },
    initialPageParam: 0,
  });
};
