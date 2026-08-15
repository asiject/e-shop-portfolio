import axios from "axios";
import {errorMessageFromUnknown, notifyError} from "@utils/notify";

export const api = axios.create({baseURL: "/api/v1"});
export const server = axios.create({baseURL: "/"});

export async function axiosProcess(caller: Function, isLogin = false) {
  try {
    return await caller();
  } catch (err: unknown) {
    console.error(" axiosProcess >>", err);
    notifyError(errorMessageFromUnknown(err));
    return null;
  }
}
export const options = {
  refetchOnWindowFocus: false,
  retry: 0,
  onSuccess: (result: any) => {
    //api 호출 성공
    // console.log("onSuccess >>", result?.data);
  },
  onError: (_error: any) => {
    //api 호출 실패
  },
};
