import Orders from "@order/entity/Orders";
import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";
import {editOrdersStatus, getOrdersByComplete, getOrdersByShipment, getOrdersByStatus} from "@order/service/ordersService";
export default async function (fastify: FastifyInstance) {
  // 장바구니 > 데이터 저장 > 주문하기(uuid로 조회)
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const orders: Orders[] = await getOrdersByComplete();
    reply.send(orders);
  });

  fastify.get("/wait", async (req: FastifyRequest, reply: FastifyReply) => {
    const orders: Orders[] = await getOrdersByStatus("WAIT");
    reply.send(orders);
  });

  fastify.get("/claim/cancel", async (req: FastifyRequest, reply: FastifyReply) => {
    const orders: Orders[] = await getOrdersByStatus("REQ_CANCEL");
    reply.send(orders);
  });
  fastify.get("/claim/return", async (req: FastifyRequest, reply: FastifyReply) => {
    const orders: Orders[] = await getOrdersByStatus("REQ_RETURN");
    reply.send(orders);
  });
  fastify.get("/claim/change", async (req: FastifyRequest, reply: FastifyReply) => {
    const orders: Orders[] = await getOrdersByStatus("REQ_CHANGE");
    reply.send(orders);
  });
  fastify.get("/shipment", async (req: FastifyRequest, reply: FastifyReply) => {
    const orders: Orders[] = await getOrdersByShipment();
    reply.send(orders);
  });

  fastify.put("/status", async (req: FastifyRequest<{Body: {ids: string[]; status: string}}>, reply: FastifyReply) => {
    const {ids, status} = req.body;
    const result = await editOrdersStatus(ids, status);
    reply.send(result);
  });
}
