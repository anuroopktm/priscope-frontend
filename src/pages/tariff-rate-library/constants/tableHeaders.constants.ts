// export const TARIFF_RATE_HEADERS = (t: (ns: string, key: string) => string): string[] => [
//   t('tariff', 'tableHeaders.countryOfOrigin'),
//   t('tariff', 'tableHeaders.countryOfDestination'),
//   t('tariff', 'tableHeaders.hsCode'),
//   t('tariff', 'tableHeaders.rate'),
//   t('tariff', 'tableHeaders.validUntil'),
//   t('tariff', 'tableHeaders.updatedBy'),
//   t('tariff', 'tableHeaders.updatedOn'),
//   t('tariff', 'tableHeaders.id'),
//   t('tariff', 'tableHeaders.status'),
// ];
export const TARIFF_RATE_HEADERS = (): string[] => [
  'Country of Origin',
  'Country of Destination',
  'HS Code',
  'Rate',
  'Valid Until',
  'Updated By',
  'Updated On',
  'ID',
  'Status',
];