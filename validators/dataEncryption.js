import Cryptr from "cryptr";

const cryptr = new Cryptr("myTotalySecretKey");

export const encryption = (value) => {
  const encryptData = cryptr.encrypt(value);
  return encryptData;
};

export const decryption = (value) => {
  const decryptedData = cryptr.decrypt(value);
  return decryptedData;
};
