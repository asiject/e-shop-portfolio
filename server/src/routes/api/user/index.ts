import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import payment from "./userPayment";
import address from "./userAddress";
import userOrders from "./userOrders";
import cart from "@api/cart";
import {addUser} from "@user/service/userService";
import {UserRegisterProps} from "@props";

export default async function (fastify: FastifyInstance) {
  fastify.register(userOrders, {prefix: "/:userid/order"});
  fastify.register(cart, {prefix: "/:userid/cart"});
  fastify.register(payment, {prefix: "/:userid/payment"});
  fastify.register(address, {prefix: "/:userid/address"});

  fastify.post("/register", async (req: FastifyRequest<{Body: UserRegisterProps}>, reply: FastifyReply) => {
    const user = await addUser(req.body);
    reply.send("refreshToken");
  });
}
