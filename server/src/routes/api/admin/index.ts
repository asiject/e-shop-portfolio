import {FastifyInstance} from "fastify";
import category from "./category";
import menu from "./menu";
import orders from "./orders";
import product from "./product";
import role from "./role";
import user from "./user";

export default async function (fastify: FastifyInstance) {
  fastify.register(menu, {prefix: "/menues"});

  fastify.register(user, {prefix: "/users"});
  fastify.register(role, {prefix: "/role"});
  fastify.register(orders, {prefix: "/orders"});
  fastify.register(category, {prefix: "/category"});
  fastify.register(product, {prefix: "/product"});
}
