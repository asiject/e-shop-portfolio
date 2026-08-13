import Menu from "@menu/entity/Menu";
import {txProcess} from "@lib/db";

export async function getMenuList() {
  return await Menu.find({order: {sortno: "ASC"}});
}
export async function editMenusUseYn(id: number, useyn: string) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Menu);
    return await repository.update({id}, {useyn});
  });
}
export async function editBatchMenus(menues: {id: number; useyn?: string; sortno?: number}[]) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Menu);
    const result = [];
    for (const {id, useyn, sortno} of menues) {
      const updated = await repository.update({id}, {useyn, sortno});
      result.push(updated);
    }
    return result;
  });
}
export async function addMenu(menu: Menu) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Menu);
    return await repository.save(menu);
  });
}
export async function removeMenu(id: number) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Menu);
    return await repository.delete({id});
  });
}
