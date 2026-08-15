import statics from "@fastify/static";
import formbody from "@fastify/formbody";
import fastifyView from "@fastify/view";
import path from "path";
import ejs from "ejs";
import {FastifyInstance} from "fastify";
import multipart from "@fastify/multipart";
import cookie from "@fastify/cookie";
import {eshop} from "@config/eshop.config";
export default async function (fastify: FastifyInstance) {
  /* FormBody */
  fastify.register(formbody);
  fastify.register(multipart, {
    attachFieldsToBody: true,
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      fieldSize: 100, // Max field value size in bytes
      fields: 10, // Max number of non-file fields
      fileSize: 1000000, // For multipart forms, the max file size in bytes
      files: 10, // Max number of file fields
      headerPairs: 2000, // Max number of header key=>value pairs
    },
  });

  /* VIEWS */
  // view engine 정의
  fastify.register(fastifyView, {engine: {ejs}});
  /* STATIC */
  fastify.register(statics, {root: path.join(process.cwd(), "/public"), prefix: "/public/", decorateReply: false});
  fastify.register(statics, {root: path.join(process.cwd(), "/public/assets"), prefix: "/assets/", decorateReply: false});
  fastify.register(statics, {
    root: path.join(process.cwd(), "/node_modules"),
    prefix: "/node_modules/",
    decorateReply: false,
  });

  /* CORS */
  /*
  fastify.register(cors, (_: any) => {
    return (_: any, callback: (error: Error | null, options: FastifyCorsOptions) => void) => {
      let corsOption: FastifyCorsOptions = {origin: true};
      return callback(null, corsOption);
    };
  });
   */
  fastify.register(cookie, {
    secret: eshop?.token?.secret, // for cookies signature

    //   hook: "preHandler", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
    // 브라우저→Vite 프록시→API는 같은 오리진. sameSite 생략 시 Lax. 크로스 도메인일 때만 none + secure
    parseOptions: {httpOnly: true},
  });
}
