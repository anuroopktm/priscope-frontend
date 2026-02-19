export const ITEM_MASTER_ENDPOINTS = {
  upload: () => `/common/upload`,
  mapFields: (upload_id: string | number) =>
    `/item-master/${upload_id}/map-fields`,
  listSystemFields: () => `/item-master/system-fields/search`,
  listTemplates: () => `/item-master/templates/search`,
  listTemplateHeaders: (template_id: string | number) =>
    `/item-master/templates/${template_id}/headers`,
  listItems: () => `/item-master/items/search_v2`,
  saveItemMasterComment: (item_master_id: string | number) =>
    `/item-master/${item_master_id}/comments`,
  bulkInsert: "/item-master/bulk-insert",
  listHeaders: "/item-master/headers/search",
  listComments: `/item-master/comments/search`,
  listDataV2: `/item-master/items/search_v2`,
  editDataitemMaster: (item_id: string | number) => `/item-master/${item_id}`,
  deleteItemMasterRow: `/item-master/items`,
  createAdminRequest: `/approval-requests`,
  getItemMasterHistory: (item_id: string) => `/item-master/${item_id}/history/search`,
  getItemById: (itemId: string) => `/item-master/${itemId}`,
  addHeader:`/item-master/add-header`,
  saveFilter:`/item-master/filters`
};
