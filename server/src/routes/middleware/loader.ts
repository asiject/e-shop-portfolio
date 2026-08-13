import {FastifyInstance} from "fastify";
import lifecycle from "./lifecycle";
import register from "./register";
export default async function (fastify: FastifyInstance) {
  register(fastify);
  lifecycle(fastify);
}
