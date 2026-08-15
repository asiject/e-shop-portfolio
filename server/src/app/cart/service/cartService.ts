import Cart from "@cart/entity/Cart";
import {txProcess} from "@lib/db";
import {DeleteResult, UpdateResult} from "typeorm";

function cartOption(cart: Pick<Cart, "option">) {
  return cart.option ? String(cart.option) : "";
}

export async function getCartList(userid: string) {
  return await Cart.find({where: {userid}, relations: ["product"]});
}

export async function addCart(cart: Cart) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Cart);
    const {userid, pid, itemid} = cart;
    const option = cartOption(cart);
    const existing = await repository.findOne({where: {userid, pid, itemid, option}});
    if (existing) {
      return await repository.update({id: existing.id}, {count: Number(existing.count) + Number(cart.count)});
    }
    return await repository.save({...cart, option});
  });
}

export async function editCart(cart: Cart): Promise<UpdateResult> {
  const {userid, pid, itemid, count} = cart;
  const option = cartOption(cart);
  return await txProcess(async manager => {
    const repository = manager.getRepository(Cart);
    return await repository.update({userid, pid, itemid, option}, {count});
  });
}

export async function removeCart(id: number): Promise<DeleteResult> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Cart);
    return await repository.delete({id});
  });
}
