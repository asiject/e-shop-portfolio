import CategoryProduct from "@category/entity/CategoryProduct";
import Product from "@product/entity/Product";
import {txProcess} from "@lib/db";
import {DeleteResult, UpdateResult} from "typeorm";

export async function getProductList(): Promise<Product[]> {
  return await Product.find();
}
export async function getNewProductList(): Promise<Product[]> {
  return await Product.find({order: {createdate: "DESC"}});
}
export async function getProductInfo(id: number): Promise<Product | null> {
  return await Product.findOne({where: {id}, relations: {images: true, options: {items: true}}});
}

export async function addProduct({
  categoryids,
  price,
  productname,
  stock,
  showyn,
  content,
  thumbnail,
}: {
  categoryids: number[];
  price: number;
  productname: string;
  stock: number;
  newfilelist: string[];
  delfilelist: string[];
  showyn: string;
  content: string;
  details: any[];
  thumbnail: string;
  images: string[];
}) {
  return await txProcess(async manager => {
    const prodRepository = manager.getRepository(Product);
    const cateRepository = manager.getRepository(CategoryProduct);
    //1. 상품 등록
    const product = await prodRepository.save({
      title: productname,
      cost: price,
      capacity: stock,
      optionCnt: stock,
      description: "sample",
      thumbnail,
      showyn,
      editor: content,
    });
    //2. 상품 카테고리 등록
    const categories = [];
    for (let i = 0; i < categoryids.length; i++) {
      const category = await cateRepository.save({
        id: categoryids[i] + "_" + product.id,
        category: {id: categoryids[i]},
        product: {id: product.id},
        sortno: i + 1, // 갯수 +
        showyn,
      });
      categories.push(category);
    }
    //3. 상품 이미지 등록
    //4. 상품 옵션 등록
    console.log("product, categories >>", product, categories);
  });
}

export async function editProductSortno(products: {id: number; showyn: string}[]) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Product);
    const result = [];
    for (const {id, showyn} of products) {
      const data = await repository.update({id}, {showyn});
      result.push(data);
    }
    return result;
  });
}
export async function editProduct(product: Product): Promise<UpdateResult> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Product);
    return await repository.update({id: product.id}, product);
  });
}
export async function removeProduct(id: number): Promise<DeleteResult> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Product);
    return await repository.delete({id});
  });
}
