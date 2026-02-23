export const ITEM_MASTER_ENDPOINTS = {
  upload: () => `/v1/common/upload`,
  mapFields: (upload_id: string | number) =>
    `/v1/item-master/${upload_id}/map-fields`,
  listSystemFields: () => `/v1/item-master/system-fields/search`,
  listTemplates: () => `/v1/item-master/templates/search`,
  listTemplateHeaders: (template_id: string | number) =>
    `/v1/item-master/templates/${template_id}/headers`,
  listItems: () => `/v1/item-master/items/search_v2`,
  saveItemMasterComment: (item_master_id: string | number) =>
    `/v1/item-master/${item_master_id}/comments`,
  bulkInsert: "/v1/item-master/bulk-insert",
  listHeaders: "/v1/item-master/headers/search",
  listComments: `/v1/item-master/comments/search`,
  listDataV2: `/v1/item-master/items/search_v2`,
  editDataitemMaster: (item_id: string | number) => `/v1/item-master/${item_id}`,
  deleteItemMasterRow: `/v1/item-master/items`,
  createAdminRequest: `/v1/approval-requests`,
  getItemMasterHistory: (item_id: string) => `/v1/item-master/${item_id}/history/search`,
  getItemById: (itemId: string) => `/v1/item-master/${itemId}`,
  addHeader:`/v1/item-master/add-header`,
  saveFilter:`/v1/item-master/filters`
};
