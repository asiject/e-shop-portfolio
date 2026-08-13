import {txProcess} from "@lib/db";
import DiscountPolicy from "@policy/entity/DiscountPolicy";
import {UpdateResult} from "typeorm";

export async function getDiscountPolicy(): Promise<DiscountPolicy[]> {
  return await DiscountPolicy.find();
}
export async function editDiscountPolicy(policy: DiscountPolicy): Promise<UpdateResult> {
  return await txProcess(async manager => {
    const reposigory = manager.getRepository(DiscountPolicy);
    return await reposigory.update({id: policy.id}, policy);
  });
}
