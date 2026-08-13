import {txProcess} from "@lib/db";
import UserLoginHistory from "@user/entity/UserLoginHistory";

export async function addLoginHistory(history: {userid: string; ssoid: string; token?: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserLoginHistory);
    return await repository.save(history);
  });
}
