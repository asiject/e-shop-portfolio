import Product from "@product/entity/Product";
import {addProduct, editProduct, getNewProductList, getProductInfo, getProductList, removeProduct} from "@product/service/productService";
import {addProductQna, getProductQnas, parseQnaKind} from "@product/service/productQnaService";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {DeleteResult, UpdateResult} from "typeorm";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const products: Product[] = await getProductList();
    reply.send(products);
  });
  fastify.get("/new", async (req: FastifyRequest, reply: FastifyReply) => {
    const products: Product[] = await getNewProductList();
    reply.send(products);
  });
  fastify.get("/:id/qna", async (req: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply) => {
    const productid = Number(req.params.id);
    if (!productid) return reply.code(400).send({message: "INVALID_PRODUCT"});
    const list = await getProductQnas(productid);
    reply.send(list);
  });
  fastify.post(
    "/:id/qna",
    async (
      req: FastifyRequest<{
        Params: {id: number};
        Body: {userid?: string; username?: string; kind?: string; body?: string; orderid?: string};
      }>,
      reply: FastifyReply,
    ) => {
      const productid = Number(req.params.id);
      const {userid, username, kind, body, orderid} = req.body || {};
      const parsedKind = parseQnaKind(kind);
      if (!productid) return reply.code(400).send({message: "INVALID_PRODUCT"});
      if (!userid) return reply.code(401).send({message: "LOGIN_REQUIRED"});
      if (!parsedKind) return reply.code(400).send({message: "INVALID_KIND"});
      if (!body?.trim()) return reply.code(400).send({message: "EMPTY_BODY"});
      const product = await getProductInfo(productid);
      if (!product) return reply.code(404).send({message: "PRODUCT_NOT_FOUND"});
      const row = await addProductQna({
        productid,
        userid,
        username,
        kind: parsedKind,
        body: body.trim(),
        orderid,
      });
      reply.send(row);
    },
  );
  fastify.get("/:id", async (req: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply) => {
    const {id} = req.params;
    const product: Product | null = await getProductInfo(id);
    reply.send(product);
  });

  // fastify.post("/", async (req: FastifyRequest<{Params: {categoryid: number}; Body: Product}>, reply: FastifyReply) => {
  //   const product: Product = req.body;
  //   const result: Product = await addProduct(product);
  //   reply.send(result);
  // });

  fastify.put("/", async (req: FastifyRequest<{Params: {categoryid: number}; Body: Product}>, reply: FastifyReply) => {
    const product: Product = req.body;
    const result: UpdateResult = await editProduct(product);
    reply.send(result);
  });

  fastify.delete("/:productid", async (req: FastifyRequest<{Params: {categoryid: number; productid: number}}>, reply: FastifyReply) => {
    const {productid} = req.params;
    const result: DeleteResult = await removeProduct(productid);
    reply.send(result);
  });
}
