import {FastifyReply} from "fastify";
import {addMinutes} from "date-fns";
import {editUserRefresh} from "@user/service/userService";
import {addLoginHistory} from "@user/service/userLoginHistoryService";
import {signJWT, verifyJWT} from "@utils/OAuth2Utils";
import {decrypted, encrypted} from "@utils/CipherUtils";
import User from "@user/entity/User";

/** access/refresh 쿠키 발급 + 로그인 이력 (Google·데모 공통) */
export async function issueAuthSession(
  reply: FastifyReply,
  params: {userid: string; ssoid: string; email: string; user?: User | null},
) {
  const {userid, ssoid, email, user} = params;
  const access = await signJWT({userid, ssoid, email});
  const accessToken = encrypted(access);

  let refreshToken = user?.refresh_token || "";
  if (refreshToken) {
    try {
      const decryptStr = decrypted(refreshToken);
      await verifyJWT(decryptStr);
    } catch {
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
  reply.cookie("access_token", accessToken, {path: "/", signed: true, expires: addMinutes(new Date(), 30)});
  addLoginHistory({userid, ssoid, token: accessToken});
  return accessToken;
}
