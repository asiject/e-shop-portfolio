import Fastify from "fastify";
import {FastifyInstance} from "fastify";
import {Server, IncomingMessage, ServerResponse} from "http";
import middleware from "@routes/middleware/loader";
import {apiLogger as logger} from "@config/winston.config";
import {eshop} from "@config/eshop.config";
import {initDatasource} from "@lib/db";
import {isDemoLoginEnabled} from "@user/service/demoUserService";
import routes from "./routes";
const PORT: number = Number(process.env.PORT) || 4000;
const fastify: FastifyInstance<Server, IncomingMessage, ServerResponse> = Fastify();

middleware(fastify);

routes(fastify);

function warnConfig() {
  if (!eshop?.token?.secret) {
    logger.warn("config: token.secret is empty");
  }
  if (!eshop?.cipher?.key || !eshop?.cipher?.iv) {
    logger.warn("config: cipher.key/iv is empty — token encrypt/decrypt will fail");
  }
  if (!eshop?.oauth?.google?.clientId || !eshop?.oauth?.google?.clientSecret) {
    logger.warn("config: oauth.google clientId/clientSecret is empty — Google login will fail");
  }
  if (isDemoLoginEnabled()) {
    logger.warn("config: demo login enabled (POST /auth/demo) — disable in production with ENABLE_DEMO_LOGIN=false");
  }
}

async function start() {
  try {
    warnConfig();
    await initDatasource();

    //https://stackoverflow.com/questions/14043926/node-js-connect-only-works-on-localhost
    await fastify.listen({port: PORT, host: "0.0.0.0"});
    logger.info(`server start! http://127.0.0.1:${PORT}/`);
  } catch (err: any) {
    logger.error(`server loading error... ${err}`);
    process.exit(1);
  }
}

start();
