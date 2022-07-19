declare module "utils" {
  export const addImageOnServer = () => Promise<string>;

  export const removeImageFromServer = () => Promise<string | RemoveImageErrorType>;

  export interface RemoveImageErrorType {
    code: string;
    message: string;
    statusCode: string;
  }
}
