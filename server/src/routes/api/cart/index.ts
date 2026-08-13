import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";
import {DeleteResult, UpdateResult} from "typeorm";
import Cart from "@cart/entity/Cart";
import {addCart, editCart, getCartList, removeCart} from "@cart/service/cartService";

export default async function (fastify: FastifyInstance) {
  fastify.get("/:userid", async (req: FastifyRequest<{Params: {userid: string}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const cart: Cart[] = await getCartList(userid);
    reply.send(cart);
  });

  fastify.post("/", async (req: FastifyRequest<{Body: Cart}>, reply: FastifyReply) => {
    const cart: Cart = req.body;
    const result: Cart = await addCart(cart);
    reply.send(result);
  });

  fastify.put("/:userid", async (req: FastifyRequest<{Params: {userid: string}; Body: Cart}>, reply: FastifyReply) => {
    const userid = req.params;
    const cart: Cart = req.body;
    const result: UpdateResult = await editCart(cart);
    reply.send(result);
  });

  fastify.delete("/:id", async (req: FastifyRequest<{Params: {userid: string; id: number}}>, reply: FastifyReply) => {
    const {id} = req.params;
    const result: DeleteResult = await removeCart(id);
    reply.send(result);
  });
}
