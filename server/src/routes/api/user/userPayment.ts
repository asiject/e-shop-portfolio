import UserPayment from "@user/entity/UserPayment";
import {addUserPayment, editUserPayment, getUserPayment, removeUserPayment} from "@user/service/userPaymentService";
import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";
import {DeleteResult, UpdateResult} from "typeorm";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (req: FastifyRequest<{Params: {userid: string}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const payments: UserPayment[] = await getUserPayment(userid);
    reply.send(payments);
  });

  fastify.post("/", async (req: FastifyRequest<{Params: {userid: string}; Body: UserPayment}>, reply: FastifyReply) => {
    const payment = req.body;
    const result: UserPayment = await addUserPayment(payment);
    reply.send(result);
  });

  fastify.put("/", async (req: FastifyRequest<{Params: {userid: string}; Body: UserPayment}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const payment = req.body;
    const result: UpdateResult = await editUserPayment(userid, payment);
    reply.send(result);
  });

  fastify.delete("/:id", async (req: FastifyRequest<{Params: {userid: string; id: number}}>, reply: FastifyReply) => {
    const {id} = req.params;
    const result: DeleteResult = await removeUserPayment(id);
    reply.send(result);
  });
}
