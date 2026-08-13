import {cia} from "@config/cia.config";
import crypto from "crypto";

const alg = cia?.cipher?.alg;
const key = cia?.cipher?.key;
const iv = cia?.cipher?.iv;

export const encrypted = (plainText: string | undefined) => {
  if (plainText == "" || plainText == undefined) {
    return "";
  }
  let cipher = crypto.createCipheriv(alg, key, iv);
  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};
export const decrypted = (encrypted: string) => {
  let decipher = crypto.createDecipheriv(alg, key, iv);
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  return decrypted + decipher.final("utf8");
};
