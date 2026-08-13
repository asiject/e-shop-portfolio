import Category from "@category/entity/Category";
import {txProcess} from "@lib/db";
import {DeleteResult, UpdateResult} from "typeorm";

export async function getCategoryList() {
  return await Category.find({order: {sortno: "ASC"}});
}
export async function getCategoryListByType(type: string) {
  return await Category.find({where: {type}});
}
export async function getCategoryById(id: number) {
  return await Category.findOne({where: {id}});
}
export async function getCategoryProductsById(id: number) {
  return await Category.findOne({where: {id}, relations: {products: {product: true}}, order: {products: {createdate: "DESC"}}});
}

export async function addCategory(category: Category): Promise<Category> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Category);
    const result = await repository.save(category);
    console.log("result >>", result);
    return result;
  });
}
export async function editCategory(category: Category): Promise<UpdateResult> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Category);
    const result: UpdateResult = await repository.update({id: category.id}, category);
    return result;
  });
}
export async function editCategoryUseYn(id: number, useyn: string): Promise<UpdateResult> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Category);
    const result: UpdateResult = await repository.update({id}, {useyn});
    return result;
  });
}
export async function removeCategory(id: number): Promise<DeleteResult> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Category);
    const result: DeleteResult = await repository.delete({id});
    return result;
  });
}
export async function editBatchCategories(categories: {id: number; sortno?: number; useyn?: string}[]): Promise<DeleteResult> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Category);
    const result = [];
    for (const {id, sortno, useyn} of categories) {
      const updated = await repository.update({id}, {sortno, useyn});
      result.push(updated);
    }
    return result;
  });
}
