import { PRIVILEGE_ACTIONS, PRIVILEGE_MODULES } from "@/constants/privileges.constants";
import { columnFieldMap } from "../constants/freightRate.constants";
import { FREIGHT_RATE_HEADERS } from "../constants/tableHeaders.constants";
import type { CreateFreightRateRequestBodyParams, FreightRateResponse, FreightRate as FreightRateType, } from "../types";
import formatDate from "@/utils/formatDate";
import { hasPrivilege } from "@/utils/hasPrivilege";

type ContainerType = {
    id: string;
    type: string;
    description: string | null;
};

type Row = string[];

type RecordObj = {
    id: string;
    status: string;
    port_of_origin: string,
    port_of_destination: string;
    container_type_id: string | null;
    currency: string;
    rate: string;
    valid_to: string;
};

export function getContainerTypeIdByType(
    containerTypes: ContainerType[],
    type: string
): string | null {
    const match = containerTypes.find(
        (c) => c.type.toLowerCase() === type.toLowerCase()
    );
    return match ? match.id : null;
}

export function buildStatusUpdate(
    data: Row[],
    selected: Record<string, boolean>,
    newStatus: string,
    containerTypes: ContainerType[],
) {
    return data
        .filter((row) => selected[row[8]])
        .map((row) => {
            const record: RecordObj = {
                id: row[8],
                status: row[9],
                port_of_origin: row[0],
                port_of_destination: row[1],
                container_type_id: getContainerTypeIdByType(containerTypes, row[2]),
                currency: row[3],
                rate: row[4],
                valid_to: row[5],
            };

            return {
                old_record: { ...record },
                new_record: { ...record, status: newStatus },
            };
        });
}

export function getFieldNameByCol(colIndex: number): string {
    return columnFieldMap[colIndex] || "";
}

export function transformResponse(data: FreightRateResponse) {
    const headers = FREIGHT_RATE_HEADERS;
    if (!data || !data.freight_rates?.length) {
        return { headers, values: [] };
    }

    const values = data.freight_rates.map((item: FreightRateType) => [
        item.port_of_origin,
        item.port_of_destination,
        item.container_type,
        item.currency,
        item.rate,
        item.valid_to ? item.valid_to.split("T")[0] : "-",
        item.last_updated_by?.name ? String(item.last_updated_by.name) : "-",
        formatDate(item.last_updated_at),
        item.id,
        item.status,
    ]);

    return { headers, values };
}

export function createFreightRateRequestBody(
    params: CreateFreightRateRequestBodyParams
) {
    const {
        comments,
        updatedFields,
        tenantId,
        freightRateId,
        ...optionalFields
    } = params;

    // Determine if we have valid comments
    const hasComments =
        Array.isArray(comments) &&
        comments.length > 0 &&
        comments.some((c) => c.comment && c.comment.trim() !== "");

    const reqBody: Record<string, any> = {
        source: "freight_rate",
        tenant_id: tenantId,
        freight_rate_id: freightRateId,
        ...updatedFields,
    };

    // Only include action_key & comments when valid comments exist
    if (hasComments) {
        reqBody.action_key = "curr_rate";
        reqBody.comments = comments
            .filter((c) => c.comment && c.comment.trim() !== "")
            .map(({ comment, fieldKey }) => ({
                comment,
                comment_type: "field",
                field_key: fieldKey,
            }));
    }

    // Include any other optional fields
    Object.entries(optionalFields).forEach(([key, value]) => {
        if (value !== undefined) {
            reqBody[key] = value;
        }
    });

    return reqBody;
}

export function hasFreightRatePrivilages(privileges: Record<string, string[]>) {
    const hasEditFreightRatePrivilege = hasPrivilege(
        privileges,
        PRIVILEGE_MODULES.FREIGHT_RATE,
        PRIVILEGE_ACTIONS.EDIT
    );

    const hasFreightEnableDisablePrivilage = hasPrivilege(
        privileges,
        PRIVILEGE_MODULES.FREIGHT_RATE,
        PRIVILEGE_ACTIONS.ENABLE_DISABLE
    );

    const hasAddFreightRatePrivilege = hasPrivilege(
        privileges,
        PRIVILEGE_MODULES.FREIGHT_RATE,
        PRIVILEGE_ACTIONS.CREATE
    );

    const hasImportFreightRatePrivilege = hasPrivilege(
        privileges,
        PRIVILEGE_MODULES.FREIGHT_RATE,
        PRIVILEGE_ACTIONS.IMPORT
    );

    const hasExportFreightRatePrivilege = hasPrivilege(
        privileges,
        PRIVILEGE_MODULES.FREIGHT_RATE,
        PRIVILEGE_ACTIONS.EXPORT
    );

    return { hasEditFreightRatePrivilege, hasFreightEnableDisablePrivilage, hasAddFreightRatePrivilege, hasImportFreightRatePrivilege, hasExportFreightRatePrivilege }
}

