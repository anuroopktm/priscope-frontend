const StatsSummaryBar = ({
    totalProcessed,
    successfullyImported,
    skippedErrored,
}: {
    totalProcessed: number;
    successfullyImported: number;
    skippedErrored: number;
}) => {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm h-[57px] py-[7px]">
            <div className="grid grid-cols-3 gap-8 divide-x divide-gray-300">
                <div className="px-[12px]">
                    <p className="text-sm font-medium text-gray-800">Total Processed</p>
                    <p className="text-sm font-semibold text-blue-500">
                        {totalProcessed.toLocaleString()}
                    </p>
                </div>
                <div className="px-[12px]">
                    <p className="text-sm font-medium text-gray-800">
                        Successfully Imported
                    </p>
                    <p className="text-sm font-semibold text-green-500">
                        {successfullyImported.toLocaleString()}
                    </p>
                </div>
                <div className="px-[12px]">
                    <p className="text-sm font-medium text-gray-800">
                        Skipped/Errored Rows
                    </p>
                    <p className="text-sm font-semibold text-red-500">
                        {skippedErrored.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StatsSummaryBar