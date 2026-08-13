import UserLogin from "@user/entity/UserLogin";

export async function getUserLogin(ssoid: string, userid?: string) {
  const where = userid ? {ssoid, userid} : {ssoid};
  return await UserLogin.findOne({
    where,
    relations: {user: {roles: {role: true}}},
  });
}
export async function addUserLogin(ssoid: string, userid?: string) {
  return await getUserLogin(ssoid, userid);
}
