import * as naver from "https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js";

declare global {
  export const naver: typeof naver;
  export const Kakao: typeof Kakao;
}
