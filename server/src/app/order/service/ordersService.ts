import {txProcess} from "@lib/db";
import Orders from "@order/entity/Orders";

export async function getOrders(): Promise<Orders[]> {
  return await Orders.find();
}
//TODO: select 어떻게 구성해야하는지... join? 직접해야하나?
export async function getOrdersByComplete(): Promise<Orders[]> {
  return await Orders.createQueryBuilder()
    .select("orderid, buyerid, userid, status, createdate, updatedate")
    .where("status in (:...status)", {status: ["COMPLETE", "CANCEL", "RETURN", "CHANGE"]})
    .execute();
}
export async function getOrdersByStatus(status: string): Promise<Orders[]> {
  return await Orders.find({where: {status}});
}

export async function getOrdersByShipment(): Promise<Orders[]> {
  return await Orders.createQueryBuilder()
    .select("orderid, buyerid, userid, status, createdate, updatedate")
    .where("status in (:...status)", {status: ["PAYMENT"]})
    .execute();
}

export async function getOrdersById(orderid: string): Promise<Orders | null> {
  return await Orders.findOne({where: {orderid}, relations: {products: true}});
}
export async function editOrdersStatus(ids: string[], status: string): Promise<number> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Orders);
    let resultValue = 0;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const result = await repository.update({orderid: id}, {status});
      resultValue += result?.affected || 0;
    }
    return resultValue;
  });
}
