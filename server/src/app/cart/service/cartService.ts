import Cart from "@cart/entity/Cart";
import {txProcess} from "@lib/db";
import {DeleteResult, UpdateResult} from "typeorm";

export async function getCartList(userid: string) {
  return await Cart.find({where: {userid}, relations: ["product"]});
}

export async function addCart(cart: Cart) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Cart);
    const {userid, pid, itemid} = cart;
    //FIXME: 카트에서 넘어오는 상품이 여러 옵션일 경우 처리 방안
    const data = await Cart.find({where: {userid, pid, itemid}, relations: {product: true}});
    console.log("data >", data);
    if (data.length > 0) {
      return await repository.update({userid: userid, pid: pid, itemid: itemid}, {count: Number(data[0].count) + Number(cart.count)});
    } else {
      return await repository.save(cart);
    }
  });
}

export async function editCart(cart: Cart): Promise<UpdateResult> {
  // 물품 수량만 증가
  const {userid, pid, itemid} = cart;
  return await txProcess(async manager => {
    const repository = manager.getRepository(Cart);
    return await repository.update({userid: userid, pid: pid, itemid: itemid}, {count: cart.count});
  });
}

export async function removeCart(id: number): Promise<DeleteResult> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Cart);
    return await repository.delete({id});
  });
}
