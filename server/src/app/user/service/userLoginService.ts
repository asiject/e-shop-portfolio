import UserLogin from "@user/entity/UserLogin";

export async function getUserLogin(ssoid: string, userid?: string) {
  return await UserLogin.findOne({where: {ssoid, userid}, relations: {user: true}});
}
export async function addUserLogin(ssoid: string, userid?: string) {
  return await UserLogin.findOne({where: {ssoid, userid}, relations: {user: true}});
}
