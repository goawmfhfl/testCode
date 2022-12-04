import { UploadFileType } from "@models/index";

export interface ProductImageType {
  id: string;
  url: string | undefined;
  type: UploadFileType;
}
