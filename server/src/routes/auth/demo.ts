import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {DemoLoginRole} from "@user/UserConstants";
import {ensureDemoUser, isDemoLoginEnabled} from "@user/service/demoUserService";
import {issueAuthSession} from "./issueAuthSession";

const DEMO_ROLES: DemoLoginRole[] = ["USER", "ADMIN"];

export default async function (fastify: FastifyInstance) {
  fastify.post(
    "/",
    async (req: FastifyRequest<{Body: {role?: string}}>, reply: FastifyReply) => {
      if (!isDemoLoginEnabled()) {
        return reply.code(404).send({message: "DEMO_LOGIN_DISABLED"});
      }

      const role = (req.body?.role || "").toUpperCase() as DemoLoginRole;
      if (!DEMO_ROLES.includes(role)) {
        return reply.code(400).send({message: "INVALID_DEMO_ROLE"});
      }

      try {
        const {login, user} = await ensureDemoUser(role);
        await issueAuthSession(reply, {
          userid: user.userid,
          ssoid: login.ssoid,
          email: login.email,
          user,
        });
        return reply.send({user, role});
      } catch (err) {
        console.error("demo login failed", err);
        return reply.code(500).send({message: "DEMO_LOGIN_FAILED"});
      }
    },
  );
}
