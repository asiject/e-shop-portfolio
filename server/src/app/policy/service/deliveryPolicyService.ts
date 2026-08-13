import {txProcess} from "@lib/db";
import DeliveryPolicy from "@policy/entity/DeliveryPolicy";
import {UpdateResult} from "typeorm";

export async function getDeliveryPolicy(): Promise<DeliveryPolicy[]> {
  return await DeliveryPolicy.find();
}
export async function editDeliveryPolicy(policy: DeliveryPolicy): Promise<UpdateResult> {
  return await txProcess(async manager => {
    const reposigory = manager.getRepository(DeliveryPolicy);
    return await reposigory.update({id: policy.id}, policy);
  });
}
