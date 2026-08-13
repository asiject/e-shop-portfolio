import DiscountPolicy from "@policy/entity/DiscountPolicy";
import {editDiscountPolicy, getDiscountPolicy} from "@policy/service/discountPolicyService";
import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";
import {UpdateResult} from "typeorm";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (_: FastifyRequest, reply: FastifyReply) => {
    const discount: DiscountPolicy[] = await getDiscountPolicy();
    reply.send(discount[0]);
  });

  fastify.put("/", async (req: FastifyRequest<{Body: DiscountPolicy}>, reply: FastifyReply) => {
    const policy = req.body;
    const result: UpdateResult = await editDiscountPolicy(policy);
    reply.send(result);
  });
}
