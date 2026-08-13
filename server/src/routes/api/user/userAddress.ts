import UserAddress from "@user/entity/UserAddress";
import {addUserAddress, editUserAddress, getUserAddress, removeUserAddress} from "@user/service/userAddressService";
import {FastifyInstance, FastifyRequest, FastifyReply} from "fastify";
import {DeleteResult, UpdateResult} from "typeorm";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (req: FastifyRequest<{Params: {userid: string}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const addresses: UserAddress[] = await getUserAddress(userid);
    reply.send(addresses);
  });

  fastify.post("/", async (req: FastifyRequest<{Params: {userid: string}; Body: UserAddress}>, reply: FastifyReply) => {
    const address = req.body;
    const result: UserAddress = await addUserAddress(address);
    reply.send(result);
  });

  fastify.put("/", async (req: FastifyRequest<{Params: {userid: string}; Body: UserAddress}>, reply: FastifyReply) => {
    const address = req.body;
    const result: UpdateResult = await editUserAddress(address);
    reply.send(result);
  });

  fastify.delete("/:id", async (req: FastifyRequest<{Params: {userid: string; id: number}}>, reply: FastifyReply) => {
    const {id} = req.params;
    const result: DeleteResult = await removeUserAddress(id);
    reply.send(result);
  });
}
