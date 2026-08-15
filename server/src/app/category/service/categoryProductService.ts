import CategoryProduct from "@category/entity/CategoryProduct";
import {txProcess} from "@lib/db";
import {DeleteResult, UpdateResult, In} from "typeorm";

export async function getCategoryProductList(id: number) {
  const products = await CategoryProduct.find({where: {category: {id}}, relations: {category: true, product: true}});
  return products;
}
export async function addCategoryProduct(categoryid: number, productids: string): Promise<CategoryProduct[]> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(CategoryProduct);
    const idArr: string[] = productids.split(",");
    const showyn = "Y";
    const result: CategoryProduct[] = [];
    for (let i = 0; i < idArr?.length; i++) {
      const productid: number = Number(idArr[i]);
      const product: CategoryProduct = await repository.save({productid, categoryid, sortno: i + 1, showyn});
      result.push(product);
    }
    return result;
  });
}
export async function addBatchCategoryProduct(categoryid: number, pids: number[]) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(CategoryProduct);

    const existsData = await repository.find({where: {categoryid, productid: In(pids)}});
    const products = pids.filter(pid => existsData?.filter(cp => cp.productid != pid))?.map(productid => ({categoryid, productid}));
    const result = await repository.save(products);
    return result;
  });
}
export async function editCategoryProductSortno(categoryid: number, productids: string): Promise<number> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(CategoryProduct);
    const idArr: string[] = productids.split(",");
    let affected: number = 0;
    for (let i = 0; i < idArr?.length; i++) {
      const productid: number = Number(idArr[i]);
      const sortno: number = i + 1;
      const result: UpdateResult = await repository.update({category: {id: categoryid}, product: {id: productid}}, {sortno});
      affected += Number(result.affected);
    }
    return affected;
  });
}

export async function editCategoryProductShowyn(categoryid: number, productids: string, showyn: string): Promise<number> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(CategoryProduct);
    const idArr: string[] = productids.split(",");
    let affected: number = 0;
    for (let i = 0; i < idArr?.length; i++) {
      const productid: number = Number(idArr[i]);
      const sortno: number = i + 1;
      const result: UpdateResult = await repository.update({category: {id: categoryid}, product: {id: productid}}, {showyn});
      affected += Number(result.affected);
    }
    return affected;
  });
}
export async function removeCategeryProduct(categoryid: number, productid: number): Promise<DeleteResult> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(CategoryProduct);
    const result: DeleteResult = await repository.delete({product: {id: productid}, category: {id: categoryid}});
    return result;
  });
}
