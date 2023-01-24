import { UploadFileType } from "..";

export interface DescriptionImage {
  id: string;
  filename?: string;
  file?: File;
  url: string;
  size: number;
  type: UploadFileType;
}
