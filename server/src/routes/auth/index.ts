// import {getUserLogin} from "@user/service/UserLoginService";
import {editUserRefresh, getUserInfo, getUserInfoByRefreshToken} from "@user/service/userService";
import {signJWT, verifyJWT} from "@utils/OAuth2Utils";
import {decrypted, encrypted} from "@utils/CipherUtils";
import {FastifyInstance, FastifyRequest, FastifyReply} from "fastify";
import google from "./google";
// import kakao from "./kakao";
import {ERROR_AUTH_EXPIRED, ERROR_AUTH_NOTEXISTS, ERROR_AUTH_REFRESH_EXPIRED, ERROR_AUTH_TOKEN_NOTEXISTS, ERROR_AUTH_UNVALID} from "@error/AuthCode";
import {getUserLogin} from "@user/service/userLoginService";
import {addLoginHistory} from "@user/service/userLoginHistoryService";
import {addMinutes} from "date-fns";
import {jwtProps} from "@props";
export default async function (fastify: FastifyInstance) {
  // google(fastify);
  fastify.register(google, {prefix: "/google"});
  // fastify.register(kakao, {prefix: "/kakao"});

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
    // 사용자가 SSO Login을 하고 입력을 하고, 토큰을 요청할 때 호출한다
    const {ssoid, userid} = req.body;

    const user = await getUserLogin(ssoid, userid); //db에 저장된 유저의 정보를 가지고 온다.

    //에러처리 방식.. 고민... 필요... 그냥 무조건 ok 하고 error를 success에서 처리?
    if (!user) {
      return reply.code(ERROR_AUTH_NOTEXISTS).send("ERROR_AUTH_NOTEXISTS"); //유저가 있어서 token을 요청했는데 없으니가 에러를 일으킨다.
    }
    // 액세스 토큰을 만든다. refresh token은 일단, 액세스 토큰과 동일하다
    const {email} = user;
    const access = await signJWT({userid, ssoid, email});
    const accessToken = encrypted(access);

    // refresh 토큰을 재발급 받는 과정이다
    let refreshToken = user?.user?.refresh_token || "";
    if (refreshToken) {
      // refresh 토큰이 있다면 복호화하고 검증한다
      // console.log("Refresh Token : ", refreshToken);
      try {
        const decryptStr = decrypted(refreshToken);
        await verifyJWT(decryptStr);
      } catch (err) {
        // 유효하지 않은 토큰이 있다면 다시 업데이트 한다
        // console.log("Token is expired");
        const refresh = await signJWT({userid, ssoid, email}, "30d");
        refreshToken = encrypted(refresh);
        await editUserRefresh(userid, {refresh_token: refreshToken});
      }
    } else {
      const refresh = await signJWT({userid, ssoid, email}, "30d");
      refreshToken = encrypted(refresh);
      await editUserRefresh(userid, {refresh_token: refreshToken});
    }

    reply.cookie("refresh_token", refreshToken, {path: "/", signed: true});
    //FIXME: access_token을 30분 짜리로 만들어서 줘?!
    reply.cookie("access_token", accessToken, {path: "/", signed: true, expires: addMinutes(new Date(), 30)});
    //발급한 토큰을 저장한다
    addLoginHistory({userid, ssoid, token: accessToken});
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
      //FIXME: access_token을 30분 짜리로 만들어서 줘?!
      reply.cookie("access_token", access_token, {path: "/", signed: true});
      await addLoginHistory({userid, ssoid, token: access_token});
      return reply.send("USER_AUTHENTICATED");
    } catch (err) {
      return reply.code(ERROR_AUTH_REFRESH_EXPIRED).send("ERROR_AUTH_REFRESH_EXPIRED");
    }
  });
}
