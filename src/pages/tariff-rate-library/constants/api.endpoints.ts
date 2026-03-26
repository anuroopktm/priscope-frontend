export const TARIFF_RATE_ENDPOINTS = {
  upload: () => `/v1/common/upload`,
  createTariffRate: `/v1/tariff-rates`,
  getTariffRates: `/v1/tariff-rates/search`,
  getTariffRateById: (tariff_rate_id: string) => `/v1/tariff-rates/${tariff_rate_id}`,
  getTariffRateComments: `/v1/tariff-rates/comments/search`,
  getTariffRateHistory: (tariff_rate_id: string) => `/v1/tariff-rates/${tariff_rate_id}/history/search`,
  getTariffRateChanges: (tariff_rate_id: string) => `/v1/tariff-rates/${tariff_rate_id}/rate-changes/search`,
  getTariffRateUploads: `/v1/common/uploads`,
  getTariffRateUploadSummaryCounts: (upload_id: number | string) => `/v1/common/upload-summary/${upload_id}/counts`,
  getTariffRateErrorFile: (upload_id: number | string) => `/v1/common/uploads/${upload_id}/error-file`,
  updateTariffRate: (tariff_rate_id: number | string) => `/v1/tariff-rates/${tariff_rate_id}`,
  bulkStatusUpdate: `/v1/tariff-rates/bulk-status-update`,
  createAdminRequest: `/v1/approval-requests`,
  saveTariffRateComment: (tariff_rate_id: string | number) => `/v1/tariff-rates/${tariff_rate_id}/comments`
};
