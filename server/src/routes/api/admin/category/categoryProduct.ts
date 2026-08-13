import CategoryProduct from "@category/entity/CategoryProduct";
import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";
import {
  addBatchCategoryProduct,
  addCategoryProduct,
  editCategoryProductShowyn,
  editCategoryProductSortno,
  getCategoryProductList,
  removeCategeryProduct,
} from "@category/service/categoryProductService";
import {DeleteResult} from "typeorm";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (req: FastifyRequest<{Params: {categoryid: number}}>, reply: FastifyReply) => {
    const {categoryid} = req.params;
    const products: CategoryProduct[] = await getCategoryProductList(categoryid);
    reply.send(products);
  });

  fastify.post("/", async (req: FastifyRequest<{Params: {categoryid: number}; Body: {pids: number[]; productids: string}}>, reply: FastifyReply) => {
    const {categoryid} = req.params;
    const {productids, pids} = req.body;
    const result = await addBatchCategoryProduct(categoryid, pids);
    reply.send(result);
  });

  fastify.put("/sortno", async (req: FastifyRequest<{Params: {categoryid: number}; Body: {productids: string}}>, reply: FastifyReply) => {
    const {categoryid} = req.params;
    const {productids} = req.body;
    const affected: number = await editCategoryProductSortno(categoryid, productids);
    reply.send({affected});
  });

  fastify.put(
    "/showyn",
    async (req: FastifyRequest<{Params: {categoryid: number}; Body: {productids: string; showyn: string}}>, reply: FastifyReply) => {
      const {categoryid} = req.params;
      const {productids, showyn} = req.body;
      const affected: number = await editCategoryProductShowyn(categoryid, productids, showyn);
      reply.send({affected});
    },
  );

  fastify.delete("/:productid", async (req: FastifyRequest<{Params: {categoryid: number; productid: number}}>, reply: FastifyReply) => {
    const {categoryid, productid} = req.params;
    const result: DeleteResult = await removeCategeryProduct(categoryid, productid);
    reply.send(result);
  });
}
