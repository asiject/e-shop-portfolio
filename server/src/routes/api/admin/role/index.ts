import {FastifyInstance, FastifyRequest} from "fastify";
import {FastifyReply} from "fastify";
import {addRole, addRoleUsers, getRoleInfo, getRoleList, getRoleUserList, removeRoleById, removeRoleByUserId} from "@role/service/roleService";
import UserRole from "@user/entity/UserRole";
import User from "@user/entity/User";
import Role from "@role/entity/Role";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const users = await getRoleList();
    reply.send(users);
  });
  fastify.get("/:roleid", async (req: FastifyRequest<{Params: {roleid: string}}>, reply: FastifyReply) => {
    const {roleid} = req.params;
    const menu = await getRoleInfo(roleid);
    reply.send(menu);
  });
  fastify.get("/:roleid/users", async (req: FastifyRequest<{Params: {roleid: string}}>, reply: FastifyReply) => {
    const {roleid} = req.params;
    const role = await getRoleUserList(roleid);
    const users: UserRole[] | undefined = role?.users;
    reply.send(users);
  });

  fastify.post("/", async (req: FastifyRequest<{Body: Role}>, reply: FastifyReply) => {
    const role = req.body;
    const menu = await addRole(role);
    reply.send(menu);
  });
  fastify.post("/:roleid", async (req: FastifyRequest<{Params: {roleid: string}; Body: {uids: string[]}}>, reply: FastifyReply) => {
    const {roleid} = req.params;
    const {uids} = req.body;
    const users = await addRoleUsers(roleid, uids);
    reply.send(users);
  });
  fastify.get("/:roleid/duplicate", async (req: FastifyRequest<{Params: {roleid: string}}>, reply: FastifyReply) => {
    const {roleid} = req.params;
    const menu = await getRoleInfo(roleid);
    reply.send(menu);
  });
  fastify.delete("/:roleid/:userid", async (req: FastifyRequest<{Params: {roleid: string; userid: string}}>, reply: FastifyReply) => {
    const {roleid, userid} = req.params;
    const user = await removeRoleByUserId(roleid, userid);
    console.log("user >>>", user);
    reply.send(user);
  });
  fastify.delete("/:roleid", async (req: FastifyRequest<{Params: {roleid: string}}>, reply: FastifyReply) => {
    const {roleid} = req.params;
    const role = await removeRoleById(roleid);
    console.log("user >>>", role);
    reply.send(role);
  });
}
