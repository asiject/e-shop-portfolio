import {api, axiosProcess, server} from "@recoils/common";
import {UserLogin} from "@props";
export async function getGoogleInfoAxios(code: string) {
  return server.post("/auth/google/callback", {code});
}
export async function getToken({userid, ssoid}: {userid: string; ssoid: string}) {
  return await axiosProcess(async () => {
    return await server.post("/auth/token", {userid, ssoid});
  });
}

export const postRegister = async (data: UserLogin & {sabun?: string}) => api.post("/user/register", data);

export const postLogout = () => server.post("/auth/logout");

export const postDemoLogin = (role: "USER" | "ADMIN") => server.post("/auth/demo", {role});
