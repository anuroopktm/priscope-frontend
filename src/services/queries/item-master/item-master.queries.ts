// import type { CommentsResponse } from "@/components/common/loader/comment-sidebar/types";
// import { axiosInstance } from "@/services/api/axiosInstance";
// import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
// import type { AxiosError } from "axios";
// import type {
//   AddBulkInsertAdminRequest,
//   AddHeaderPayload,
//   AddHeaderResponse,
//   EditItemMasterColPayload,
//   EditItemMasterColResponse,
//   ExportItemMasterRowPayload,
//   ExportItemMasterRowResponse,
//   ItemMasterBulkInsertAdminRequestResponse,
//   ItemMasterBulkUploadFormattedDataPayload,
//   ItemMasterBulkUploadResponseType,
//   itemMasterHeaderResponse,
//   SavedFiltersList,
//   SaveFilterPayload,
//   SaveFilterResponse,
// } from "../../../pages/items-master/helpers/types";
// import { useItemMasterStore } from "../../../pages/items-master/store/itemMasterStore";
// import type {
//   DeleteSelectedRowPayload,
//   DeleteSelectedRowResponse,
//   Header,
//   ListCommentsPayload,
//   ListItemsResponse,
//   ListRequestBody,
//   ListTemplateHeadersRequest,
//   ListTemplateHeadersResponse,
//   ListTemplatesResponse,
//   MapFieldsRequest,
//   MapFieldsResponse,
//   SystemFieldsResponse,
// } from "./item-master.types";

// export type UploadResponse = {
//   upload_id: string;
//   url: string;
//   message: string;
// };

// export interface ItemHistory {
//   id: string;
//   item_id: string;
//   sku: string;
//   upc: string;
//   category: string;
//   hs_code: string;
//   description: string;
//   status: string;
//   action: string;
//   changed_at: string;
//   changed_by: number;
//   updated_fields: Record<string, any>;
//   comments: any[];
// }

// export interface ItemHistoryResponse {
//   item: string;
//   history: ItemHistory[];
// }

// export interface ItemHistoryQuery {
//   item_id: string;
//   search?: string;
// }

// export interface SystemFields {
//   field_id: string;
//   field_name: string;
//   field_type: string;
// }

// export const useUploadItemMasterFile = () => {
//   return useMutation<
//     UploadResponse,
//     AxiosError<{ detail: string | string[] }>,
//     { file: File }
//   >({
//     mutationFn: async ({ file }) => {
//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await axiosInstance.post<UploadResponse>(
//         `/v1/common/upload?feature=item_master`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           timeout: 60000,
//         },
//       );

//       return response.data;
//     },
//   });
// };

// export const useMapItemMasterFields = () => {
//   return useMutation<
//     MapFieldsResponse,
//     AxiosError,
//     MapFieldsRequest & { upload_id: string; update_if_exists: boolean }
//   >({
//     mutationFn: async ({ payload, upload_id, update_if_exists }) => {
//       const response = await axiosInstance.post<MapFieldsResponse>(
//         `/v1/item-master/${upload_id}/map-fields?update_if_exists=${update_if_exists}`,
//         payload,
//         { timeout: 60000 },
//       );
//       return response.data;
//     },
//   });
// };

// export const useListSystemFields = () => {
//   return useMutation<SystemFieldsResponse, AxiosError, any>({
//     mutationFn: async (payload) => {
//       const response = await axiosInstance.post<SystemFieldsResponse>(
//         `/v1/item-master/system-fields/search`,
//         payload,
//         { timeout: 60000 },
//       );
//       return response.data;
//     },
//   });
// };

// export const useCreateItemMasterComment = () => {
//   return useMutation<any, AxiosError, { payload: any; itemMasterId: string }>({
//     mutationFn: async ({ payload, itemMasterId }) => {
//       const response = await axiosInstance.post(
//         `/v1/item-master/${itemMasterId}/comments`,
//         payload,
//         { timeout: 60000 },
//       );
//       return response.data;
//     },
//   });
// };

// export const useEditItemMasterItem = () => {
//   return useMutation<
//     EditItemMasterColResponse,
//     AxiosError<{ detail: string | string[] }>,
//     EditItemMasterColPayload & { item_id: string }
//   >({
//     mutationFn: async ({ payload, item_id }) => {
//       const response = await axiosInstance.put<EditItemMasterColResponse>(
//         `/v1/item-master/${item_id}`,
//         payload,
//       );
//       return response.data;
//     },
//   });
// };

// export const useBulkInsertItems = () => {
//   return useMutation<
//     ItemMasterBulkUploadResponseType,
//     AxiosError,
//     ItemMasterBulkUploadFormattedDataPayload
//   >({
//     mutationFn: async (payload) => {
//       const response =
//         await axiosInstance.post<ItemMasterBulkUploadResponseType>(
//           `/v1/item-master/bulk-insert`,
//           payload,
//         );
//       return response.data;
//     },
//   });
// };

// export const useDeleteItemMasterRow = () => {
//   return useMutation<
//     DeleteSelectedRowResponse,
//     AxiosError,
//     DeleteSelectedRowPayload
//   >({
//     mutationFn: async (payload) => {
//       const response = await axiosInstance.delete<DeleteSelectedRowResponse>(
//         `/v1/item-master/items`,
//         { data: payload },
//       );
//       return response.data;
//     },
//   });
// };

// export const useExportItemMasterRow = () => {
//   return useMutation<
//     ExportItemMasterRowResponse,
//     AxiosError,
//     ExportItemMasterRowPayload
//   >({
//     mutationFn: async (payload) => {
//       const response = await axiosInstance.post<ExportItemMasterRowResponse>(
//         `/v1/exports`,
//         payload,
//       );
//       return response.data;
//     },
//   });
// };

// export const useAddBulkInsertAdminRequest = () => {
//   return useMutation<
//     ItemMasterBulkInsertAdminRequestResponse,
//     AxiosError,
//     AddBulkInsertAdminRequest
//   >({
//     mutationFn: async (payload) => {
//       const response =
//         await axiosInstance.post<ItemMasterBulkInsertAdminRequestResponse>(
//           `/v1/approval-requests`,
//           payload,
//         );
//       return response.data;
//     },
//   });
// };

// export const useAddHeader = () => {
//   return useMutation<AddHeaderResponse, AxiosError, AddHeaderPayload>({
//     mutationFn: async (payload) => {
//       const response = await axiosInstance.post<AddHeaderResponse>(
//         `/v1/item-master/add-header`,
//         payload,
//       );
//       return response.data;
//     },
//   });
// };

// export const useSaveFilter = () => {
//   return useMutation<SaveFilterResponse, AxiosError, SaveFilterPayload>({
//     mutationFn: async (payload) => {
//       const response = await axiosInstance.post<SaveFilterResponse>(
//         `/v1/item-master/filters`,
//         payload,
//       );
//       return response.data;
//     },
//   });
// };

// // ---------------------- QUERIES ----------------------

// export const useListTemplates = () => {
//   return useInfiniteQuery({
//     queryKey: ["templates"],
//     queryFn: async ({ pageParam = 0 }) => {
//       const payload: ListRequestBody = {
//         search: "",
//         page_size: 50,
//         skip: pageParam,
//       };

//       const response = await axiosInstance.post<ListTemplatesResponse>(
//         `/v1/item-master/templates/search`,
//         payload,
//       );

//       return response.data;
//     },
//     getNextPageParam: (lastPage, allPages) => {
//       const totalFetched = allPages.flatMap((p) => p.templates).length;
//       const totalAvailable = lastPage.total ?? 0;
//       return totalFetched < totalAvailable ? totalFetched : undefined;
//     },
//     staleTime: 1000 * 60 * 5,
//     initialPageParam: 0,
//   });
// };

// export const useListTemplateHeaders = () => {
//   return useMutation<
//     ListTemplateHeadersResponse,
//     AxiosError,
//     ListTemplateHeadersRequest & { template_id: string }
//   >({
//     mutationFn: async ({ payload, template_id }) => {
//       const response = await axiosInstance.post<ListTemplateHeadersResponse>(
//         `/v1/item-master/templates/${template_id}/headers`,
//         payload,
//         { timeout: 60000 },
//       );
//       return response.data;
//     },
//   });
// };

// export const useListItems = (payload: Omit<ListRequestBody, "skip">) => {
//   return useInfiniteQuery({
//     queryKey: ["listItems", payload.search, payload.filter],
//     queryFn: async ({ pageParam = 0 }) => {
//       const response = await axiosInstance.post<ListItemsResponse>(
//         `/v1/item-master/items/search_v2`,
//         {
//           search: payload.search ?? "",
//           page_size: payload.page_size ?? 100,
//           skip: pageParam,
//           filters: payload.filter,
//         },
//       );
//       return response.data;
//     },
//     getNextPageParam: (lastPage, allPages) => {
//       const totalFetched = allPages.reduce(
//         (acc, page) => acc + page.items.length,
//         0,
//       );
//       return lastPage.items.length < (payload.page_size ?? 100)
//         ? undefined
//         : totalFetched;
//     },
//     initialPageParam: 0,
//   });
// };

// export const useListHeaders = (payload: ListRequestBody) => {
//   const setTableHeaders = useItemMasterStore((s) => s.setTableHeaders);

//   return useQuery<
//     itemMasterHeaderResponse,
//     AxiosError,
//     itemMasterHeaderResponse
//   >({
//     queryKey: ["listItemMasterHeaders", payload.skip, payload.search],
//     queryFn: async () => {
//       const response = await axiosInstance.post<itemMasterHeaderResponse>(
//         `/v1/item-master/headers/search`,
//         payload,
//         { timeout: 60000 },
//       );

//       if (response.data?.headers) {
//         const idColumn: Header = {
//           id: "Id",
//           created_at: "",
//           data_type: "string",
//           is_mandatory: true,
//           label: "Id",
//           name: "id",
//           updated_at: "",
//         };

//         setTableHeaders([idColumn, ...response.data.headers]);
//       }

//       return response.data;
//     },
//     refetchOnWindowFocus: false,
//   });
// };

// export const useListComments = () => {
//   return useMutation<CommentsResponse, AxiosError, ListCommentsPayload>({
//     mutationFn: async (payload) => {
//       const { data } = await axiosInstance.post<CommentsResponse>(
//         `/v1/item-master/comments/search`,
//         payload,
//       );
//       return data;
//     },
//   });
// };

// export const useItemMasterHistory = ({
//   item_id,
//   search = "",
// }: ItemHistoryQuery) => {
//   return useQuery<ItemHistoryResponse, AxiosError>({
//     queryKey: ["item-master-history", item_id, search],
//     queryFn: async () => {
//       const response = await axiosInstance.get<ItemHistoryResponse>(
//         `/v1/item-master/${item_id}/history/search`,
//         { params: { search, skip: 0, limit: 100 } },
//       );
//       return response.data;
//     },
//     enabled: Boolean(item_id),
//     refetchOnWindowFocus: false,
//   });
// };

// export const useGetItemMasterById = (item_id?: string) => {
//   return useQuery<any, AxiosError>({
//     queryKey: ["item-master-by-id", item_id],
//     queryFn: async () => {
//       const response = await axiosInstance.get(`/v1/item-master/${item_id}`);
//       return response.data;
//     },
//     enabled: Boolean(item_id),
//     refetchOnWindowFocus: false,
//   });
// };

// export const useListSavedFilter = () => {
//   return useQuery<SavedFiltersList, AxiosError>({
//     queryKey: ["saved-filter"],
//     queryFn: async () => {
//       const response = await axiosInstance.get<SavedFiltersList>(
//         `/v1/item-master/filters`,
//       );
//       return response.data;
//     },
//     refetchOnWindowFocus: false,
//   });
// };
