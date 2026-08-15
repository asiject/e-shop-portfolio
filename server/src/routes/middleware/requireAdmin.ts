import {FastifyReply, FastifyRequest} from "fastify";
import {jwtProps} from "@props";
import {getUserInfo} from "@user/service/userService";

export function getRequestJwt(req: FastifyRequest): jwtProps | null {
  const jwt = (req.body as {jwt?: jwtProps} | null | undefined)?.jwt;
  if (!jwt?.userid) return null;
  return jwt;
}

export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  const jwt = getRequestJwt(req);
  if (!jwt) {
    return reply.code(401).send({message: "LOGIN_REQUIRED"});
  }
  const user = await getUserInfo(String(jwt.userid));
  if (!user?.isAdmin) {
    return reply.code(403).send({message: "ADMIN_REQUIRED"});
  }
}
