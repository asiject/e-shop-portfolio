import CategoryProduct from "@category/entity/CategoryProduct";
import Product from "@product/entity/Product";
import ProductImage from "@product/entity/ProductImage";
import ProductOption from "@product/entity/ProductOption";
import ProductOptionItems from "@product/entity/ProductOptionItems";
import {txProcess} from "@lib/db";
import {DeleteResult, UpdateResult} from "typeorm";

export type ProductOptionInput = {
  optkey: string;
  optvals: string;
  items?: {
    itemkey: string;
    itemval: string;
    price?: number;
    capacity?: number;
    useyn?: string;
  }[];
};

export type AddProductInput = {
  categoryids: number[];
  price: number;
  productname: string;
  stock: number;
  showyn: string;
  content?: string;
  description?: string;
  thumbnail?: string;
  images?: string[];
  details?: ProductOptionInput[];
  newfilelist?: string[];
  delfilelist?: string[];
};

export async function getProductList(): Promise<Product[]> {
  return await Product.find();
}
export async function getNewProductList(): Promise<Product[]> {
  return await Product.find({order: {createdate: "DESC"}});
}
export async function getProductInfo(id: number): Promise<Product | null> {
  return await Product.findOne({where: {id}, relations: {images: true, options: {items: true}, categories: true}});
}

export async function addProduct(input: AddProductInput) {
  const {
    categoryids = [],
    price,
    productname,
    stock,
    showyn = "Y",
    content = "",
    description = "",
    thumbnail = "",
    images = [],
    details = [],
  } = input;

  return await txProcess(async manager => {
    const prodRepository = manager.getRepository(Product);
    const cateRepository = manager.getRepository(CategoryProduct);
    const optionRepository = manager.getRepository(ProductOption);
    const optionItemRepository = manager.getRepository(ProductOptionItems);
    const imageRepository = manager.getRepository(ProductImage);

    const product = await prodRepository.save({
      title: productname,
      cost: Number(price) || 0,
      capacity: Number(stock) || 0,
      optionCnt: Number(stock) || 0,
      description: (description || content || "").slice(0, 100),
      thumbnail: thumbnail || "",
      showyn: showyn || "Y",
      editor: content || "",
    });

    for (let i = 0; i < categoryids.length; i++) {
      await cateRepository.save({
        categoryid: Number(categoryids[i]),
        productid: product.id,
        sortno: i + 1,
        showyn: showyn || "Y",
      });
    }

    for (const detail of details) {
      if (!detail?.optkey) continue;
      const option = await optionRepository.save({
        optkey: detail.optkey,
        optvals: detail.optvals || "",
        product: {id: product.id},
      });
      for (const item of detail.items || []) {
        await optionItemRepository.save({
          productid: product.id,
          itemkey: item.itemkey || detail.optkey,
          itemval: item.itemval || "",
          price: Number(item.price) || 0,
          capacity: Number(item.capacity) || 0,
          useyn: item.useyn || "Y",
          option: {optionid: option.optionid},
        });
      }
    }

    for (let i = 0; i < images.length; i++) {
      if (!images[i]) continue;
      await imageRepository.save({
        path: images[i],
        sortno: i + 1,
        product: {id: product.id},
      });
    }

    return product;
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

export async function editProduct(body: {
  id: number;
  title?: string;
  description?: string;
  thumbnail?: string;
  cost?: number;
  capacity?: number;
  optionCnt?: number;
  showyn?: string;
  editor?: string;
  images?: string[] | {path?: string}[];
}): Promise<UpdateResult> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Product);
    const {id, title, description, thumbnail, cost, capacity, optionCnt, showyn, editor, images} = body;
    const productId = Number(id);
    const patch: Partial<Product> = {};
    if (title !== undefined) patch.title = title;
    if (description !== undefined) patch.description = description;
    if (thumbnail !== undefined) patch.thumbnail = thumbnail;
    if (cost !== undefined) patch.cost = cost;
    if (capacity !== undefined) patch.capacity = capacity;
    if (optionCnt !== undefined) patch.optionCnt = optionCnt;
    if (showyn !== undefined) patch.showyn = showyn;
    if (editor !== undefined) patch.editor = editor;
    const result = await repository.update({id: productId}, patch);
    // 한글 주석: 경로 문자열 배열일 때만 갤러리를 교체. 스토어 PUT의 ProductImage[]는 건드리지 않음
    const imagePaths = Array.isArray(images) && images.every((path): path is string => typeof path === "string") ? images : null;
    if (imagePaths) {
      const imageRepository = manager.getRepository(ProductImage);
      await imageRepository.delete({product: {id: productId}});
      for (let i = 0; i < imagePaths.length; i++) {
        if (!imagePaths[i]) continue;
        await imageRepository.save({
          path: imagePaths[i],
          sortno: i + 1,
          product: {id: productId},
        });
      }
    }
    return result;
  });
}

export async function removeProduct(id: number): Promise<DeleteResult> {
  return await txProcess(async manager => {
    const productId = Number(id);
    await manager.getRepository(CategoryProduct).delete({productid: productId});
    await manager.getRepository(ProductOptionItems).delete({productid: productId});
    await manager.getRepository(ProductOption).delete({product: {id: productId}});
    await manager.getRepository(ProductImage).delete({product: {id: productId}});
    return await manager.getRepository(Product).delete({id: productId});
  });
}
