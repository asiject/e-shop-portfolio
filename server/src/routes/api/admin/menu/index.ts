import Menu from "@menu/entity/Menu";
import {addMenu, editBatchMenus, editMenusUseYn, getMenuList, removeMenu} from "@admin/service/adminMenuService";
import {FastifyReply} from "fastify";
import {FastifyRequest} from "fastify";
import {FastifyInstance} from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const menus = await getMenuList();
    reply.send(menus);
  });
  fastify.post("/", async (req: FastifyRequest<{Body: Menu}>, reply: FastifyReply) => {
    const m = req.body;
    const menu = await addMenu(m);
    reply.send(menu);
  });
  fastify.delete("/:id", async (req: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply) => {
    const {id} = req.params;
    const menu = await removeMenu(id);
    reply.send(menu);
  });
  fastify.put("/:id/useyn", async (req: FastifyRequest<{Params: {id: number}; Body: {useyn: string}}>, reply: FastifyReply) => {
    const {id} = req.params;
    const {useyn} = req.body;
    const result = await editMenusUseYn(id, useyn);
    reply.send(result);
  });
  fastify.put("/sortno", async (req: FastifyRequest<{Body: {menues: {id: number; sortno: number}[]}}>, reply: FastifyReply) => {
    const {menues} = req.body;
    const result = await editBatchMenus(menues);
    reply.send(result);
  });
  fastify.put("/useyn", async (req: FastifyRequest<{Body: {menues: {id: number; useyn: string}[]}}>, reply: FastifyReply) => {
    const {menues} = req.body;
    const result = await editBatchMenus(menues);
    reply.send(result);
  });
}
