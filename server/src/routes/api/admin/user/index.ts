import {FastifyInstance, FastifyRequest} from "fastify";
import {FastifyReply} from "fastify";
import {getAdminUserList, getUserInfo, getUserList} from "@user/service/userService";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const users = await getUserList();
    reply.send(users);
  });
  fastify.get("/roles", async (req: FastifyRequest, reply: FastifyReply) => {
    const users = await getAdminUserList();
    reply.send(users);
  });
  fastify.get("/:userid", async (req: FastifyRequest<{Params: {userid: string}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const user = await getUserInfo(userid);
    reply.send(user);
  });
}
