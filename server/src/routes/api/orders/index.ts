import Orders from "@order/entity/Orders";
import {getOrders, getOrdersById} from "@order/service/ordersService";
import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";
export default async function (fastify: FastifyInstance) {
  // 장바구니 > 데이터 저장 > 주문하기(uuid로 조회)
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const orders: Orders[] = await getOrders();
    reply.send(orders);
  });

  fastify.get("/:orderid", async (req: FastifyRequest<{Params: Orders}>, reply: FastifyReply) => {
    const {orderid} = req.params;
    const order: Orders | null = await getOrdersById(orderid);
    reply.send(order);
  });
}
