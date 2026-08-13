import {ensureDefaultAdminMenus} from "@admin/service/adminMenuService";
import Role from "@role/entity/Role";
import {DemoLoginRole, LOGIN_TYPE} from "@user/UserConstants";
import User from "@user/entity/User";
import UserLogin from "@user/entity/UserLogin";
import UserRole from "@user/entity/UserRole";

const DEMO_ACCOUNTS: Record<
  DemoLoginRole,
  {ssoid: string; email: string; username: string; sabun: number}
> = {
  USER: {
    ssoid: "demo-user-1958",
    email: "demo-user@1958.local",
    username: "데모유저",
    sabun: 9998001,
  },
  ADMIN: {
    ssoid: "demo-admin-1958",
    email: "demo-admin@1958.local",
    username: "데모관리자",
    sabun: 9998002,
  },
};

function withAdminFlag(user: User): User {
  const adminRole = user?.roles?.find(({role}) => role.roleid === "ADMIN");
  user.isAdmin = Boolean(adminRole);
  return user;
}

async function ensureAdminRole() {
  const existing = await Role.findOne({where: {roleid: "ADMIN"}});
  if (existing) return existing;
  return await Role.save({roleid: "ADMIN", rolename: "관리자"});
}

async function loadDemoLogin(ssoid: string) {
  return await UserLogin.findOne({
    where: {ssoid},
    relations: {user: {roles: {role: true}}},
  });
}

/** 데모 계정이 없으면 생성하고, 관리자면 ADMIN 역할과 빈 menu 테이블 기본 항목을 보장한다 */
export async function ensureDemoUser(role: DemoLoginRole): Promise<{login: UserLogin; user: User}> {
  const account = DEMO_ACCOUNTS[role];
  let login = await loadDemoLogin(account.ssoid);

  if (!login?.user) {
    const user = await User.save({
      username: account.username,
      photo: "",
      sabun: account.sabun,
    });
    await UserLogin.save({
      userid: user.userid,
      email: account.email,
      ssoid: account.ssoid,
      type: LOGIN_TYPE.DEMO,
    });
    login = await loadDemoLogin(account.ssoid);
  }

  if (!login?.user) {
    throw new Error("DEMO_USER_CREATE_FAILED");
  }

  if (role === "ADMIN") {
    await ensureAdminRole();
    await ensureDefaultAdminMenus();
    const hasAdmin = login.user.roles?.some(({roleid}) => roleid === "ADMIN");
    if (!hasAdmin) {
      await UserRole.save({userid: login.user.userid, roleid: "ADMIN"});
      login = await loadDemoLogin(account.ssoid);
    }
  }

  if (!login?.user) {
    throw new Error("DEMO_USER_LOAD_FAILED");
  }

  return {login, user: withAdminFlag(login.user)};
}

export function isDemoLoginEnabled() {
  if (process.env.ENABLE_DEMO_LOGIN === "true") return true;
  if (process.env.ENABLE_DEMO_LOGIN === "false") return false;
  return process.env.NODE_ENV !== "production";
}
