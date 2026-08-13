import Role from "@role/entity/Role";
import UserRole from "@user/entity/UserRole";
import {txProcess} from "@lib/db";
import {In} from "typeorm";

export async function getRoleList(): Promise<Role[]> {
  return await Role.find();
}
export async function getRoleInfo(roleid: string): Promise<Role | null> {
  return await Role.findOne({where: {roleid}});
}
export async function getRoleUserList(roleid: string): Promise<Role | null> {
  return await Role.findOne({where: {roleid}, relations: {users: {user: true}}});
}
export async function removeRoleByUserId(roleid: string, userid: string): Promise<UserRole | null> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserRole);
    return await repository.delete({role: {roleid: roleid}, user: {userid: userid}});
  });
}
export async function removeRoleById(roleid: string): Promise<UserRole | null> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Role);
    return await repository.delete({roleid});
  });
}
export async function addRole(role: Role): Promise<Role | null> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Role);
    return await repository.save(role);
  });
}
export async function addRoleUsers(roleid: string, uids: string[]): Promise<UserRole | null> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserRole);
    const users = uids?.map(userid => ({roleid, userid}));
    const result = await repository.save(users);
    return result;
  });
}
