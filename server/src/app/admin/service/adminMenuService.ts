import Menu from "@menu/entity/Menu";
import {txProcess} from "@lib/db";

/** 관리자 사이드바 기본 메뉴. insert_seed.sql 과 항목을 맞출 것 */
export const DEFAULT_ADMIN_MENUS: {title: string; url: string; sortno: number}[] = [
  {title: "menu.dashboard", url: "/admin/dashboard", sortno: 1},
  {title: "menu.product", url: "/admin/product", sortno: 2},
  {title: "menu.category", url: "/admin/category", sortno: 3},
  {title: "menu.order", url: "/admin/order", sortno: 4},
  {title: "menu.shipment", url: "/admin/shipment", sortno: 5},
  {title: "menu.claim", url: "/admin/claim", sortno: 6},
  {title: "menu.policy", url: "/admin/policy", sortno: 7},
  {title: "menu.role", url: "/admin/role", sortno: 8},
  {title: "menu.menu", url: "/admin/menu", sortno: 9},
];

/** menu 테이블이 비어 있을 때만 기본 메뉴를 넣는다. 기존 커스텀 행은 유지 */
export async function ensureDefaultAdminMenus() {
  const count = await Menu.count();
  if (count > 0) return;

  await txProcess(async manager => {
    const repository = manager.getRepository(Menu);
    await repository.save(DEFAULT_ADMIN_MENUS.map(item => ({...item, useyn: "Y"})));
  });
}

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
