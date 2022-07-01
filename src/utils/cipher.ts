import CryptoJS from "crypto-js";

const qualification = () => {
  return {
    key: CryptoJS.enc.Utf8.parse("JF11WwmwWci!mVVRYW.MRcwsWFRM7f6l"),
    iv: CryptoJS.enc.Utf8.parse("1Rs.Vs7RwlYJ.!7."),
    padding: CryptoJS.pad.Pkcs7,
    keySize: 256,
  };
};

export const encryptedData = (plainData: string) => {
  const result = CryptoJS.AES.encrypt(plainData, qualification().key, {
    iv: qualification().iv,
    keySize: qualification().keySize,
    padding: qualification().padding,
  });

  return result.toString();
};

export const decryptedData = (plainData: string) => {
  const result = CryptoJS.AES.decrypt(plainData, qualification().key, {
    iv: qualification().iv,
    keySize: qualification().keySize,
    padding: qualification().padding,
  });

  return result.toString();
};
