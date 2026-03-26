type Row = string[];

type RecordObj = {
    id: string;
    status: string;
    country_of_origin: string,
    country_of_destination: string;
    hs_code: string;
    rate: string;
    valid_to: string;
};

export function buildStatusUpdate(
    data: Row[],
    selected: Record<string, boolean>,
    newStatus: string
) {
    return data
        .filter((row) => selected[row[7]])
        .map((row) => {
            const record: RecordObj = {
                id: row[7],
                status: row[8],
                country_of_origin: row[0],
                country_of_destination: row[1],
                hs_code: row[2],
                rate: row[3],
                valid_to: row[4],
            };

            return {
                old_record: { ...record },
                new_record: { ...record, status: newStatus },
            };
        });
}
