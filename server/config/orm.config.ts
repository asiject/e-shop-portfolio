import localConfig from "./json/ormconfig.local.json";
import devConfig from "./json/ormconfig.dev.json";
import prodConfig from "./json/ormconfig.prod.json";
const isProd = process.env.NODE_ENV === "production";
const isLocal = process.env.NODE_ENV === "local";
export default isProd ? prodConfig : isLocal ? localConfig : devConfig;
