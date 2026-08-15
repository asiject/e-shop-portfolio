import {FastifyInstance, FastifyRequest} from "fastify";
import cart from "./cart";
import orders from "./orders";
import policy from "./policy";
import user from "./user";
import category from "./category";
import {FastifyReply} from "fastify";
import admin from "./admin";
import product from "./product";
import file from "./file";
import User from "@user/entity/User";
import UserLogin from "@user/entity/UserLogin";

export default async function (fastify: FastifyInstance) {
  fastify.register(category, {prefix: "/category"});
  fastify.register(product, {prefix: "/product"});
  fastify.register(file, {prefix: "/file"});
  fastify.register(cart, {prefix: "/cart"});
  fastify.register(orders, {prefix: "/order"});
  fastify.register(policy, {prefix: "/policy"});
  fastify.register(user, {prefix: "/user"});
  fastify.register(admin, {prefix: "/admin"});

  fastify.post("/refreshToken", async (req: FastifyRequest<{Body: {refresh_token: string}}>, reply: FastifyReply) => {
    reply.send("refreshToken");
  });
  //FIXME: 기존 소스 임
  fastify.route({
    method: "POST",
    url: "/login",
    handler: async (req: FastifyRequest<{Body: {email: string; username: string; refresh_token: string}}>, reply: FastifyReply) => {
      const {email, username, refresh_token} = req.body;
      const users = await UserLogin.findOne({where: {email}, relations: {user: true}});
      const user = users?.user;
      if (user) {
        const adminRole = user?.roles?.find(({role}) => role.roleid == "ADMIN");
        user.isAdmin = adminRole ? true : false;
        reply.send(user);
      } else {
        //회원가입 페이지로 이동?
        // const user = await User.save({userid: email, username, refresh_token});
        // console.log("user >>", user);
        reply.send(user);
      }
    },
  });
}
