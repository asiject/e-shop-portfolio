import {addOrders, getUserOrders, getUserOrdersById, saveOrderCheckout, updateUserOrderStatus} from "@order/service/userOrdersService";
import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (req: FastifyRequest<{Params: {userid: string}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const orders = await getUserOrders(userid);
    reply.send(orders);
  });

  fastify.get("/:orderid", async (req: FastifyRequest<{Params: {userid: string; orderid: string}}>, reply: FastifyReply) => {
    const {userid, orderid} = req.params;
    const order = await getUserOrdersById(userid, orderid);
    reply.send(order);
  });

  fastify.post("/", async (req: FastifyRequest<{Params: {userid: string}; Body: {status: string; products: any}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const {status, products} = req.body ?? {};
    if (!Array.isArray(products) || products.length === 0) {
      return reply.code(400).send({message: "EMPTY_ORDER_PRODUCTS"});
    }
    try {
      const order = await addOrders(userid, status, products);
      reply.send(order);
    } catch (err: any) {
      const message = String(err?.message ?? "");
      if (message.includes("EMPTY_ORDER_PRODUCTS") || message.includes("INVALID_ORDER_PRODUCT")) {
        return reply.code(400).send({message: "EMPTY_ORDER_PRODUCTS"});
      }
      throw err;
    }
  });

  fastify.put(
    "/:orderid/status",
    async (req: FastifyRequest<{Params: {userid: string; orderid: string}; Body: {status: string}}>, reply: FastifyReply) => {
      const {userid, orderid} = req.params;
      const {status} = req.body ?? {};
      if (!status) {
        return reply.code(400).send({message: "EMPTY_ORDER_STATUS"});
      }
      const result = await updateUserOrderStatus(userid, orderid, status);
      reply.send(result);
    },
  );

  fastify.put(
    "/:orderid/checkout",
    async (
      req: FastifyRequest<{
        Params: {userid: string; orderid: string};
        Body: {
          status: string;
          buyername: string;
          buyerEmail: string;
          buyerPhone: string;
          type: string;
          price: number;
          charge: number;
          total: number;
          receiver: string;
          postcode: string;
          address1: string;
          address2: string;
          description: string;
          receiverEmail: string;
          receiverPhone: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const {userid, orderid} = req.params;
      const body = req.body;
      if (!body?.buyername || !body?.type) {
        return reply.code(400).send({message: "EMPTY_CHECKOUT"});
      }
      const result = await saveOrderCheckout(userid, orderid, body);
      reply.send(result);
    },
  );
}
