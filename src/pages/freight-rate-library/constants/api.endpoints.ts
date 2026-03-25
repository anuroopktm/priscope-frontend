export const FREIGHT_RATE_ENDPOINTS = {
  upload: () => `/v1/common/upload`,
  getFreightRates: `/v1/freight-rates/search`,
  getFreightRateById: (freight_rate_id: string) =>
    `/v1/freight-rates/${freight_rate_id}`,
  createFreightRate: `/v1/freight-rates`,
  getContainerTypes: `/v1/freight-rates/container-types/search`,
  getGlobalCurrencies: `/v1/global-currencies`,
  getFreightRateUploads: `/v1/common/uploads`,
  getFreightRateUploadSummaryCounts: (upload_id: number | string) =>
    `/v1/common/upload-summary/${upload_id}/counts`,
  getFreightRateErrorFile: (upload_id: number | string) =>
    `/v1/common/uploads/${upload_id}/error-file`,
  createContainerType: `/v1/freight-rates/container-types`,
  getFreightRateHistory: (freight_rate_id: string) =>
    `/v1/freight-rates/${freight_rate_id}/history/search`,
  getFreightRateChanges: (freight_rate_id: string) =>
    `/v1/freight-rates/${freight_rate_id}/rate-changes/search`,
  updateFreightRate: (freight_rate_id: number | string) =>
    `/v1/freight-rates/${freight_rate_id}`,
  bulkStatusUpdate: `/v1/freight-rates/bulk-status-update`,
  getFreightRateComments: `/v1/freight-rates/comments/search`,
  createAdminRequest: `/v1/approval-requests`,
  approvalRequests: `/v1/approval-requests/search`,
  saveFreightRateComment: (freight_rate_id: string | number) =>
    `/v1/freight-rates/${freight_rate_id}/comments`,
};
