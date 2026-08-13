import UserPayment from "@user/entity/UserPayment";
import {txProcess} from "@lib/db";
import {DeleteResult, UpdateResult} from "typeorm";

export async function getUserPayment(userid: string): Promise<UserPayment[]> {
  return await UserPayment.find({where: {userid}});
}

export async function addUserPayment(payment: UserPayment): Promise<UserPayment> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserPayment);
    return await repository.save(payment);
  });
}

export async function editUserPayment(userid: string, payment: UserPayment): Promise<UpdateResult> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserPayment);
    return await repository.update({id: payment.id, userid}, payment);
  });
}

export async function removeUserPayment(id: number): Promise<DeleteResult> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserPayment);
    return await repository.delete({id});
  });
}
