import {getUserInfo, getUserInfoByRefreshToken} from "@user/service/userService";
import {signJWT, verifyJWT} from "@utils/OAuth2Utils";
import {decrypted, encrypted} from "@utils/CipherUtils";
import {FastifyInstance, FastifyRequest, FastifyReply} from "fastify";
import google from "./google";
import demo from "./demo";
import {ERROR_AUTH_NOTEXISTS, ERROR_AUTH_REFRESH_EXPIRED, ERROR_AUTH_TOKEN_NOTEXISTS, ERROR_AUTH_UNVALID} from "@error/AuthCode";
import {getUserLogin} from "@user/service/userLoginService";
import {addLoginHistory} from "@user/service/userLoginHistoryService";
import {jwtProps} from "@props";
import {issueAuthSession} from "./issueAuthSession";

export default async function (fastify: FastifyInstance) {
  fastify.register(google, {prefix: "/google"});
  fastify.register(demo, {prefix: "/demo"});

  fastify.get("/user", async (req: FastifyRequest<{Body: {jwt: jwtProps}}>, reply: FastifyReply) => {
    const {jwt} = req.body;
    const userid = jwt?.userid;
    if (userid) {
      const user = await getUserInfo(userid);
      reply.send(user);
    } else {
      reply.send(null);
    }
  });

  fastify.post("/logout", async (req: FastifyRequest, reply: FastifyReply) => {
    reply.cookie("access_token", "", {path: "/", signed: true, expires: new Date()});
    reply.cookie("refresh_token", "", {path: "/", signed: true, expires: new Date()});
  });

  fastify.post("/token", async (req: FastifyRequest<{Body: {ssoid: string; userid: string}}>, reply: FastifyReply) => {
    const {ssoid, userid} = req.body;

    const userLogin = await getUserLogin(ssoid, userid);

    if (!userLogin) {
      return reply.code(ERROR_AUTH_NOTEXISTS).send("ERROR_AUTH_NOTEXISTS");
    }

    const {email} = userLogin;
    const accessToken = await issueAuthSession(reply, {
      userid,
      ssoid,
      email,
      user: userLogin.user,
    });
    reply.send(accessToken);
  });

  //FIXME: 에러처리 방법......
  fastify.post("/refreshToken", async (req: FastifyRequest, reply: FastifyReply) => {
    const result = req.unsignCookie(req.cookies["refresh_token"] || "");
    if (!result || result.value == null) {
      return reply.code(ERROR_AUTH_TOKEN_NOTEXISTS).send("ERROR_AUTH_TOKEN_NOTEXISTS");
    }

    if (!result.valid) {
      return reply.code(ERROR_AUTH_UNVALID).send("ERROR_AUTH_UNVALID");
    }

    const refresh_token = result.value || "";
    const user = await getUserInfoByRefreshToken(refresh_token);

    if (!user) {
      return reply.code(ERROR_AUTH_NOTEXISTS).send("ERROR_AUTH_NOTEXISTS");
    }

    try {
      const decryptStr = decrypted(refresh_token);
      const {userid, ssoid, email} = await verifyJWT(decryptStr);
      const access = await signJWT({userid, ssoid, email});
      const access_token = encrypted(access);
      reply.cookie("access_token", access_token, {path: "/", signed: true});
      await addLoginHistory({userid, ssoid, token: access_token});
      return reply.send("USER_AUTHENTICATED");
    } catch (err) {
      return reply.code(ERROR_AUTH_REFRESH_EXPIRED).send("ERROR_AUTH_REFRESH_EXPIRED");
    }
  });
}
