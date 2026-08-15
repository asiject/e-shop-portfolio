import {eshop} from "@config/eshop.config";
import crypto from "crypto";

const alg = eshop?.cipher?.alg || "aes-256-cbc";

// 한글 주석: aes-256-cbc는 key 32바이트·iv 16바이트 필요 — 설정 문자열을 해시해 길이 맞춤
const key = crypto.createHash("sha256").update(String(eshop?.cipher?.key ?? "")).digest();
const iv = crypto.createHash("md5").update(String(eshop?.cipher?.iv ?? "")).digest();

export const encrypted = (plainText: string | undefined) => {
  if (plainText == "" || plainText == undefined) {
    return "";
  }
  if (!eshop?.cipher?.key || !eshop?.cipher?.iv) {
    throw new Error("cipher.key / cipher.iv is not configured");
  }
  let cipher = crypto.createCipheriv(alg, key, iv);
  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};
export const decrypted = (encrypted: string) => {
  if (!eshop?.cipher?.key || !eshop?.cipher?.iv) {
    throw new Error("cipher.key / cipher.iv is not configured");
  }
  let decipher = crypto.createDecipheriv(alg, key, iv);
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  return decrypted + decipher.final("utf8");
};
