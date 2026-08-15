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

type OrderProductInput = {
  productid?: number;
  pid?: number;
  itemid?: number;
  option?: string;
  count?: number;
  cost?: number;
};

function toOrderProductRows(products: OrderProductInput[]): Array<{
  productid: number;
  itemid: number;
  option: string;
  count: number;
  cost: number;
}> {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("EMPTY_ORDER_PRODUCTS");
  }
  const rows = products
    .map(item => {
      const productid = Number(item?.productid ?? item?.pid);
      const count = Number(item?.count);
      const cost = Number(item?.cost);
      return {
        productid,
        itemid: Number(item?.itemid) || 0,
        option: item?.option ? String(item.option) : "",
        count,
        cost,
      };
    })
    .filter(row => Number.isFinite(row.productid) && row.productid > 0 && Number.isFinite(row.count) && row.count > 0 && Number.isFinite(row.cost) && row.cost >= 0);
  if (rows.length === 0) {
    throw new Error("INVALID_ORDER_PRODUCT");
  }
  return rows;
}

export async function addOrders(userid: string, status: string, products: Array<any>): Promise<Orders | null> {
  const rows = toOrderProductRows(products);
  return await txProcess(async manager => {
    const orderid = uuid();
    const ordersRepository = manager.getRepository(Orders);
    const order = await ordersRepository.save({orderid, userid, status: status || "TEMP"});
    const productRepository = manager.getRepository(OrderProduct);
    // 한글 주석: map(async)는 저장을 기다리지 않아 빈 주문이 커밋됨. 순차 await로 같은 트랜잭션에 넣는다
    for (const row of rows) {
      await productRepository.save({...row, orderid});
    }
    return order;
  });
}
export type OrderCheckoutInput = {
  status: string;
  buyername: string;
  buyerEmail: string;
  buyerPhone: string;
  type: string;
  price: number;
  charge: number;
  total: number;
  receiver: string;
  postcode: string;
  address1: string;
  address2: string;
  description: string;
  receiverEmail: string;
  receiverPhone: string;
};

export async function updateUserOrderStatus(userid: string, orderid: string, status: string): Promise<UpdateResult> {
  return await txProcess(async manager => {
    const ordersRepository = manager.getRepository(Orders);
    return await ordersRepository.update({userid, orderid}, {status});
  });
}

export async function saveOrderCheckout(userid: string, orderid: string, body: OrderCheckoutInput): Promise<UpdateResult> {
  return await txProcess(async manager => {
    const ordersRepository = manager.getRepository(Orders);
    const buyerRepository = manager.getRepository(OrderBuyer);
    const paymentRepository = manager.getRepository(OrderPayment);
    const deliveryRepository = manager.getRepository(OrderDelivery);

    const buyer = manager.create(OrderBuyer, {
      orderid,
      buyername: body.buyername,
      email: body.buyerEmail,
      phone: body.buyerPhone,
    });
    const payment = manager.create(OrderPayment, {
      orderid,
      type: body.type,
      price: body.price,
      charge: body.charge,
      total: body.total,
    });
    const delivery = manager.create(OrderDelivery, {
      orders: {orderid} as Orders,
      receiver: body.receiver,
      postcode: body.postcode,
      address1: body.address1,
      address2: body.address2,
      email: body.receiverEmail,
      phone: body.receiverPhone,
      description: body.description,
    });

    await buyerRepository.save(buyer);
    await paymentRepository.save(payment);
    await deliveryRepository.save(delivery);
    return await ordersRepository.update({orderid, userid}, {status: body.status});
  });
}
