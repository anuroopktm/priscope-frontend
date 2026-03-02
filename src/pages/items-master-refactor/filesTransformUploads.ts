import formatDate from "@/utils/formatDate";
import { FILE_UPLOAD_STATUS } from "./constants/filesmodal.constants";

export const transformUploads = (res: any) => {
  if (!res?.uploads) return [];

  return res.uploads
    .filter(
      (item: any) =>
        item.status !== FILE_UPLOAD_STATUS.PROCESSING &&
        item.status !== FILE_UPLOAD_STATUS.UPLOADED,
    )
    .map((item: any) => {
      const createdAt = new Date(item.created_at);

      return {
        id: item.id,
        title: item.file_name,
        status:
          item.status === FILE_UPLOAD_STATUS.SUCCESS ||
          item.status === FILE_UPLOAD_STATUS.PROCESSED
            ? "Success"
            : "Failed",
        uploadDate: formatDate(item.created_at),
        uploadTime: createdAt.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        uploadedBy: item?.created_by?.name ?? "",
        updatedDate: formatDate(item.updated_at),
        errorFile:
          item.status === FILE_UPLOAD_STATUS.PROCESSED ||
          item.status === FILE_UPLOAD_STATUS.FAILED,
        hasUploadData:
          item.status === FILE_UPLOAD_STATUS.SUCCESS ||
          item.status === FILE_UPLOAD_STATUS.PROCESSED ||
          item.status === FILE_UPLOAD_STATUS.FAILED,
      };
    });
};
