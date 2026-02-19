export interface FileDetailsModalProps {
    open?: boolean;
    onClose: any;
    showSnackBar: any;
    showLoader: any;
    module: string;
    filterOptions: { value: string; label: string }[];
    defaultTab?: "uploaded" | "downloaded";

}

export interface SimplifiedExport {
    id: string;
    name: string;
    created_user_name: string;
    created_time: string;
    created_date: string;
    status: string;
};