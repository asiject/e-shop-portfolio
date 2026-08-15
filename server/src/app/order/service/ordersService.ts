import {txProcess} from "@lib/db";
import Orders from "@order/entity/Orders";
import {In} from "typeorm";

const orderRelations = {buyer: true, products: {product: true}} as const;

export async function getOrders(): Promise<Orders[]> {
  return await Orders.find();
}

export async function getOrdersByComplete(): Promise<Orders[]> {
  return await Orders.find({
    where: {status: In(["COMPLETE", "CANCEL", "RETURN", "CHANGE"])},
    relations: orderRelations,
    order: {createdate: "DESC"},
  });
}

export async function getOrdersByStatus(status: string): Promise<Orders[]> {
  return await Orders.find({
    where: {status},
    relations: orderRelations,
    order: {createdate: "DESC"},
  });
}

export async function getOrdersByShipment(): Promise<Orders[]> {
  return await Orders.find({
    where: {status: In(["PAYMENT"])},
    relations: orderRelations,
    order: {createdate: "DESC"},
  });
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
