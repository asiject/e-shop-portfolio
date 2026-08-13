import {FastifyInstance} from "fastify";
import api from "./api";
import auth from "./auth";
import pages from "./pages";

export default async function (fastify: FastifyInstance) {
  fastify.register(api, {prefix: "/api/v1"});
  fastify.register(auth, {prefix: "/auth"});
  fastify.register(pages, {prefix: "/"});
}
