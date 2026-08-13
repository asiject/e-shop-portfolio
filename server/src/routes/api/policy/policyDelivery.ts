import DeliveryPolicy from "@policy/entity/DeliveryPolicy";
import {editDeliveryPolicy, getDeliveryPolicy} from "@policy/service/deliveryPolicyService";
import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";
import {UpdateResult} from "typeorm";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (_: FastifyRequest, reply: FastifyReply) => {
    const delivery: DeliveryPolicy[] = await getDeliveryPolicy();
    reply.send(delivery[0]);
  });

  fastify.put("/", async (req: FastifyRequest<{Body: DeliveryPolicy}>, reply: FastifyReply) => {
    const policy: DeliveryPolicy = req.body;
    const result: UpdateResult = await editDeliveryPolicy(policy);
    reply.send(result);
  });
}
