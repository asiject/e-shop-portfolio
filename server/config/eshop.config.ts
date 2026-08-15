import eshop from "./json/config.json";

const isProd = process.env.NODE_ENV === "production";
const isLocal = process.env.NODE_ENV === "local";
const SERVER_URI = isProd ? eshop.server.prod : isLocal ? eshop.server.local : eshop.server.dev;
const EXCEPT_URL = [
  "/login",
  "/auth/refreshToken",
  "/auth/token",
  "/auth/demo",
  "/auth/google/callback",
  "/auth/logout",
  "/public",
  "/assets",
  "/favicon.ico",
];

export {eshop, SERVER_URI, EXCEPT_URL};
