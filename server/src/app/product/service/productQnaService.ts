import ProductQna, {ProductQnaKind} from "@product/entity/ProductQna";
import {txProcess} from "@lib/db";

const KINDS: ProductQnaKind[] = ["question", "exchange", "return"];

export function parseQnaKind(value: string | undefined): ProductQnaKind | null {
  if (!value) return null;
  return KINDS.includes(value as ProductQnaKind) ? (value as ProductQnaKind) : null;
}

export type PublicProductQna = {
  id: number;
  kind: ProductQnaKind;
  body: string;
  answer: string | null;
  createdate: Date;
  answeredat: Date | null;
};

export function toPublicProductQna(row: ProductQna): PublicProductQna {
  return {
    id: row.id,
    kind: row.kind,
    body: row.body,
    answer: row.answer ?? null,
    createdate: row.createdate,
    answeredat: row.answeredat ?? null,
  };
}

export async function getProductQnas(productid: number): Promise<ProductQna[]> {
  return await ProductQna.find({
    where: {productid},
    order: {createdate: "DESC"},
  });
}

export async function getAllProductQnas(): Promise<ProductQna[]> {
  return await ProductQna.find({
    relations: {product: true},
    order: {createdate: "DESC"},
  });
}

export async function addProductQna(input: {
  productid: number;
  userid: string;
  username?: string;
  orderid?: string;
  kind: ProductQnaKind;
  body: string;
}): Promise<ProductQna> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(ProductQna);
    return await repository.save({
      productid: input.productid,
      userid: input.userid,
      username: input.username || "",
      orderid: input.orderid || "",
      kind: input.kind,
      body: input.body,
    });
  });
}

export async function answerProductQna(id: number, answer: string): Promise<ProductQna | null> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(ProductQna);
    const row = await repository.findOne({where: {id}});
    if (!row) return null;
    row.answer = answer;
    row.answeredat = new Date();
    return await repository.save(row);
  });
}
