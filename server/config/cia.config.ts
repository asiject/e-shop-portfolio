import cia from "./json/config.json";

const isProd = process.env.NODE_ENV === "production";
const isLocal = process.env.NODE_ENV === "local";
const SERVER_URI = isProd ? cia.server.prod : isLocal ? cia.server.local : cia.server.dev;
const EXCEPT_URL = ["/login", "/auth/refreshToken", "/auth/token", "/auth/google/callback", "/auth/logout", "/public", "/assets", "/favicon.ico"];

export {cia, SERVER_URI, EXCEPT_URL};
