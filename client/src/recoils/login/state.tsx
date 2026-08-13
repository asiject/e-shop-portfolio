import {LoginAuth} from "@props";
import {atom} from "recoil";
export const loginAuthState = atom<LoginAuth>({
  key: "loginAuthState",
  default: null,
});
