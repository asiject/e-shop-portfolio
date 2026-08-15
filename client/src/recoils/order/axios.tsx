import {api, axiosProcess} from "@recoils/common";

export async function getOrderSheet(userid: string, orderid: string) {
  return await axiosProcess(async () => {
    return await api.get(`/user/${userid}/order/${orderid}`);
  });
}
export async function getOrderSheetResult(userid: string, orderid: string) {
  return await axiosProcess(async () => {
    return await api.get(`/user/${userid}/order/${orderid}`);
  });
}

export async function getRecentDestination(userid: string) {
  return await axiosProcess(async () => {
    return await api.get(`/user/${userid}/address`);
  });
}

export async function getOrderList(userid: string) {
  return await axiosProcess(async () => {
    return await api.get(`/user/${userid}/order`);
  });
}

export async function getOrderDetail(userid: string, orderid: string) {
  return await api.get(`/user/${userid}/order/${orderid}`);
}
