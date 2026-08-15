import {FastifyRequest, FastifyReply} from "fastify";
import {LOGIN_TYPE} from "@user/UserConstants";
import {checkSSO, parseJWT} from "@utils/OAuth2Utils";
import {eshop} from "@config/eshop.config";
import {OAuth2Client} from "google-auth-library";

const _google = eshop.oauth.google;
const oAuth2Client = new OAuth2Client(_google.clientId, _google.clientSecret, "postmessage");
// const authorizeUrl = oAuth2Client.generateAuthUrl({
//   access_type: "offline",
//   scope: "https://www.googleapis.com/auth/userinfo.profile",
// });

export default async function (fastify: any) {
  // Front에서 넘어온, code 처리
  fastify.post("/callback", async (req: FastifyRequest<{Body: {code: any}}>, reply: FastifyReply) => {
    const {tokens} = await oAuth2Client.getToken(req.body.code);
    const {id_token}: any = tokens;
    const profile = parseJWT(id_token);
    const ssoid = profile?.sub;
    const email = profile?.email;
    const username = profile?.name;
    const photo = profile?.picture;
    const login = await checkSSO(LOGIN_TYPE.GOOGLE, ssoid, {email, username, photo});
    //FIXME: 날려봐?
    // reply.cookie("access_token", "", {path: "/", signed: true, expires: new Date()});
    // console.log("login ", login);
    reply.send(login);
  });
}
