import {txProcess} from "@lib/db";
import {UserRegisterProps} from "@props";
import User from "@user/entity/User";
import UserLogin from "@user/entity/UserLogin";
import {In} from "typeorm";

export async function getUserList(): Promise<User[]> {
  return await User.find();
}
export async function getAdminUserList() {
  return await User.find({where: {roles: {role: {roleid: In(["ADMIN"])}}}, relations: {logins: true}});
}
export async function getUserInfo(userid: string): Promise<User | null> {
  const user = await User.findOne({where: {userid}, relations: {roles: {role: true}}});
  if (user) {
    const adminRole = user.roles?.find(({role}) => role.roleid === "ADMIN");
    user.isAdmin = Boolean(adminRole);
  }
  return user;
}
export async function addUser(params: UserRegisterProps) {
  return await txProcess(async manager => {
    const {email, username, photo, sabun, ssoid, type} = params;
    const repository = manager.getRepository(User);
    const loginRepository = manager.getRepository(UserLogin);
    const {userid} = await repository.save({username, photo, sabun});
    await loginRepository.save({userid, email, ssoid, type});
  });
}
export async function editUserRefresh(userid: string, params: {refresh_token: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(User);
    return repository.update({userid}, params);
  });
}
export async function getUserInfoByRefreshToken(refresh_token: string) {
  return await User.findOne({where: {refresh_token}});
}
