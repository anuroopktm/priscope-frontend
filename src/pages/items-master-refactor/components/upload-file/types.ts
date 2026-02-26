import type { SystemFieldObject } from "@/services/queries/item-master-refactor/item-master-refactor.types";

export type UploadFormValues = {
  activeStep: number;
  headers: string[];
  systemFields: SystemFieldObject[];
  file: File | null;
  uploadId: string;
  csvType: string;
  controlFields: Record<string, string>;
  systemFieldMapping: Record<string, string>;
  attributeConfiguration: Record<
    string,
    { dataType: string; mandatory: boolean }
  >;
  saveAsTemplate: boolean;
  templateName: string;
  selectedTemplate: string;
};

export interface ItemsMasterUploadModalProps {
  open: boolean;
  onClose: () => void;
  onImportComplete?: () => void;
}
