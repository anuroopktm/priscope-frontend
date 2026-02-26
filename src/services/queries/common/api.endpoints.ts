export const COMMON_ENDPOINTS = {
  getRateTemplate: `/v1/common/template`,
  globalCurrencies: `/v1/global-currencies`,
};

export const IMPORT_RATE_ENDPOINTS = {
  getModuleImports: `/v1/common/uploads`,
  getModuleImportSummaryCount: (upload_id: number | string) =>
    `/v1/common/upload-summary/${upload_id}/counts`,
  getModuleImportErrorFile: (upload_id: number | string) =>
    `/v1/common/uploads/${upload_id}/error-file`,
};

export const EXPORT_RATE_ENDPOINTS = {
  createExport: `/v1/exports`,
  listExports: `/v1/exports/search`,
  downloadExportFile: (id: string) => `/v1/exports/download/${id}`,
};
