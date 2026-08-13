import {atom} from "recoil";
import {server} from "@recoils/common";

/** 비로그인 null. async selector default는 Suspense 재진입 시 /auth/user 반복 호출을 유발함 */
export const userState = atom<any>({
  key: "userState",
  default: null,
});

/** 세션 유저 1회 조회. 게스트면 null 반환(호출부에서 setUser(null) 하지 말 것) */
export async function fetchSessionUser(): Promise<any | null> {
  try {
    const {data} = await server.get("/auth/user");
    if (data && data.userid != null && Number(data.userid) !== 0) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

export function isLoggedIn(user: any): boolean {
  return Boolean(user && Number(user.userid) !== 0);
}
