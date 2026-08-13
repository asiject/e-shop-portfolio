import {api, axiosProcess} from "@recoils/common";

export async function getUserList() {
  return await axiosProcess(async () => {
    return await api.get(`/admin/users`);
  });
}
