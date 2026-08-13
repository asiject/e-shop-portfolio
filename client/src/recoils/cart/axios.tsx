import {api, axiosProcess} from "@recoils/common";

export async function getCartList(userid: number) {
  return await axiosProcess(async () => {
    return await api.get(`/cart/${userid}`);
  });
}
