import {api, axiosProcess, server} from "@recoils/common";
export async function getGoogleInfoAxios(code: string) {
  return server.post("/auth/google/callback", {code});
}
export async function getToken({userid, ssoid}: {userid: string; ssoid: string}) {
  return await axiosProcess(async () => {
    return await server.post("/auth/token", {userid, ssoid});
  });
}

export const postRegister = async (data: FormData) => api.post("/user/register", data);

export const postLogout = () => server.post("/auth/logout");
