import {FastifyInstance} from "fastify";
import delivery from "@routes/api/policy/policyDelivery";
import discount from "@routes/api/policy/policyDiscount";

export default async function (fastify: FastifyInstance) {
  fastify.register(discount, {prefix: "/discount"});
  fastify.register(delivery, {prefix: "/delivery"});
}
