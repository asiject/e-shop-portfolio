import statics from "@fastify/static";
import formbody from "@fastify/formbody";
import fastifyView from "@fastify/view";
import path from "path";
import ejs from "ejs";
import {FastifyInstance} from "fastify";
import multipart from "@fastify/multipart";
import cookie from "@fastify/cookie";
import {cia} from "@config/cia.config";
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
    secret: cia?.token?.secret, // for cookies signature

    //   hook: "preHandler", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
    //FIXME: 추후에 동일한 도메인으로 수정하고, sameSite 삭제 할 것
    parseOptions: {httpOnly: true}, // options for parsing cookies
    // parseOptions: {httpOnly: true, sameSite: "none", secure: true}, // options for parsing cookies
  });
}
