import { UploadFileType } from "@models/index";

export interface ProductImageType {
  id: string;
  filename?: string;
  file?: File;
  url: string | undefined;
  type: UploadFileType;
}
