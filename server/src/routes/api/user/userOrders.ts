import OrderBuyer from "@order/entity/OrderBuyer";
import OrderDelivery from "@order/entity/OrderDelivery";
import OrderPayment from "@order/entity/OrderPayment";
import Orders from "@order/entity/Orders";
import {getManager, txProcess} from "@lib/db";
import {addOrders, editOrders, getUserOrders, getUserOrdersById} from "@order/service/userOrdersService";
import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";
import {UpdateResult} from "typeorm";

// session token
export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (req: FastifyRequest<{Params: {userid: string}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const orders: Orders[] = await getUserOrders(userid);
    reply.send(orders);
  });

  fastify.get("/:orderid", async (req: FastifyRequest<{Params: Orders}>, reply: FastifyReply) => {
    const {userid, orderid} = req.params;
    const order = await getUserOrdersById(userid, orderid);
    reply.send(order);
  });

  fastify.post("/", async (req: FastifyRequest<{Params: {userid: string}; Body: {status: string; products: any}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const {status, products} = req.body;
    const order = await addOrders(userid, status, products);
    reply.send(order);
  });

  //TODO: 쪼개기 필요
  //최종 success
  fastify.put(
    "/:orderid/status",
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
      const {status} = req.body;
      const {buyername, buyerEmail, buyerPhone} = req.body;
      const {type, price, charge, total} = req.body;
      const {receiver, postcode, address1, address2, description, receiverEmail, receiverPhone} = req.body;

      const manager = getManager();
      const orders: Orders = manager.create(Orders, {userid, orderid, status});
      const buyer: OrderBuyer = manager.create(OrderBuyer, {orderid, buyername, email: buyerEmail, phone: buyerPhone});
      const payment: OrderPayment = manager.create(OrderPayment, {orderid, type, price, charge, total});
      const delivery: OrderDelivery = manager.create(OrderDelivery, {
        orders: {orderid},
        receiver,
        postcode,
        address1,
        address2,
        email: receiverEmail,
        phone: receiverPhone,
        description,
      });

      const result: UpdateResult = await editOrders(orders, buyer, payment, delivery);
      reply.send(result);
    },
  );
}
