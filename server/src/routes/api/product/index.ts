import Product from "@product/entity/Product";
import {addProduct, editProduct, getNewProductList, getProductInfo, getProductList, removeProduct} from "@product/service/productService";
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
