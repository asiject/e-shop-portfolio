import OrderBuyer from "@order/entity/OrderBuyer";
import OrderDelivery from "@order/entity/OrderDelivery";
import OrderPayment from "@order/entity/OrderPayment";
import OrderProduct from "@order/entity/OrderProduct";
import Orders from "@order/entity/Orders";
import {txProcess} from "@lib/db";
import {uuid} from "@utils/UUIDUtils";
import {UpdateResult} from "typeorm";

export async function getUserOrders(userid: string): Promise<Orders[]> {
  return await Orders.find({where: {userid}, relations: {products: {product: true}}, order: {updatedate: "DESC", createdate: "DESC"}});
}
export async function getUserOrdersById(userid: string, orderid: string): Promise<Orders | null> {
  return await Orders.findOne({
    where: [{userid, orderid}],
    relations: {buyer: true, delivery: true, payment: true, products: {product: true}},
  });
}

export async function addOrders(userid: string, status: string, products: Array<any>): Promise<Orders | null> {
  return await txProcess(async manager => {
    const orderid = uuid();
    const ordersRepository = manager.getRepository(Orders);
    const order = await ordersRepository.save({orderid, userid, status});
    const productRepository = manager.getRepository(OrderProduct);
    products.map(async item => {
      const {productid, itemid, option, count, cost} = item;
      await productRepository.save({productid, itemid, option, count, cost, orderid});
    });
    return order;
  });
}
export async function editOrders(orders: Orders, buyer: OrderBuyer, payment: OrderPayment, delivery: OrderDelivery): Promise<UpdateResult> {
  return await txProcess(async manager => {
    const ordersRepository = manager.getRepository(Orders);
    const buyerRepository = manager.getRepository(OrderBuyer);
    const paymentRepository = manager.getRepository(OrderPayment);
    const deliveryRepository = manager.getRepository(OrderDelivery);
    //buyer, payment, delivery
    const _buyer = await buyerRepository.save(buyer);
    const _payment = await paymentRepository.save(payment);
    const _delivery = await deliveryRepository.save(delivery);
    return await ordersRepository.update({orderid: orders.orderid, userid: orders.userid}, {status: orders.status, buyer, payment, delivery});
  });
}
