import UserAddress from "@user/entity/UserAddress";
import {txProcess} from "@lib/db";
import {DeleteResult, UpdateResult} from "typeorm";

export async function getUserAddress(userid: string): Promise<UserAddress[]> {
  return await UserAddress.find({where: {userid}});
}

export async function addUserAddress(address: UserAddress): Promise<UserAddress> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserAddress);
    return await repository.save(address);
  });
}

export async function editUserAddress(address: UserAddress): Promise<UpdateResult> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserAddress);
    const result = await repository.update({id: address.id}, address);
    return result;
  });
}

export async function removeUserAddress(id: number): Promise<DeleteResult> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserAddress);
    return await repository.delete({id});
  });
}
