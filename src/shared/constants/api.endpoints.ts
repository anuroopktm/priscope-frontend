export const COMMON_ENDPOINTS = {
  getRateTemplate: `/common/template`
}

export const IMPORT_RATE_ENDPOINTS = {
  getModuleImports: `/common/uploads`,
  getModuleImportSummaryCount: (upload_id: number | string) =>
    `/common/upload-summary/${upload_id}/counts`,
  getModuleImportErrorFile: (upload_id: number | string) =>
    `/common/uploads/${upload_id}/error-file`,
};

export const EXPORT_RATE_ENDPOINTS = {
    createExport: `/exports`,
    listExports: `/exports/search`,
    downloadExportFile: (id: string) => `/exports/download/${id}`,
};
