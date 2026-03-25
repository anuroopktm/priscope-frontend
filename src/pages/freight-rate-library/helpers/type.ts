type TariffRecord = {
  country_of_origin: string;
  country_of_destination: string;
  hs_code: string;
  rate: number;
  valid_to: string;
  last_change_source: string;
};

interface TariffUpdatePayload {
  source_module: string;
  source_module_id: string;
  target_module: string;
  target_module_id: string;
  request_action: string;
  request_info: {
    old_record: TariffRecord;
    new_record: TariffRecord;
  }[];
  request_comments: string;
}

export function createAdminRequestPayload(
  sourceModule: string,
  sourceModuleId: string,
  tragetModule: string,
  targetModuleId: string,
  comments: string,
  action: string,
  requestInfo: any,
): TariffUpdatePayload {
  return {
    source_module: sourceModule,
    source_module_id: sourceModuleId,
    target_module: tragetModule,
    target_module_id: targetModuleId,
    request_action: action,
    request_info: requestInfo,
    request_comments: comments,
  };
}

interface TariffAddPayload {
  source_module: string;
  target_module: string;
  request_action: string;
  request_info: {
    new_record: TariffRecord;
  }[];
  request_comments: string;
}

export function createAddAdminRequestPayload(
  sourceModule: string,
  targetModule: string,
  comments: string,
  action: string,
  requestInfo: any,
): TariffAddPayload {
  return {
    source_module: sourceModule,
    target_module: targetModule,
    request_action: action,
    request_info: requestInfo,
    request_comments: comments,
  };
}
