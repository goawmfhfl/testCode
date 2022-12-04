import { UploadFileType } from "..";

export interface DescriptionImage {
  id: string;
  url: string;
  size: number;
  type: UploadFileType;
}
