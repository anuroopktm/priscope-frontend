const applyAlignmentFilter = (data: any, alignment: any) => {
    if (alignment === "enabled") {
        return data.filter((item: any) => item.status === "active");
    }
    if (alignment === "disabled") {
        return data.filter((item: any) => item.status === "inactive");
    }

    return data;
};

export default applyAlignmentFilter;