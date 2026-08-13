import {axiosProcess, server} from "@recoils/common";
import {atom, selector} from "recoil";
export const userSelector: any = selector({
  key: "userSelector",
  get: async () => {
    //접속중일때, 갱신하는 상황인지, 토큰만료 후 로그인 하는 상황인지 판단
    // return await axiosProcess(async () => {
    try {
      const {data} = await server.get("/auth/user");
      return data;
    } catch (err) {
      return null;
    }
    //   return data;
    // }, false);
  },
});

export const userState = atom({
  key: "userState",
  default: userSelector,
});
