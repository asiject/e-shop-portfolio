import CategoryProduct from "@category/entity/CategoryProduct";
import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";
import {getCategoryProductList} from "@category/service/categoryProductService";
import {editBatchCategories, getCategoryList} from "@category/service/categoryService";

export default async function (fastify: FastifyInstance) {
  fastify.get("/:categoryid/product", async (req: FastifyRequest<{Params: {categoryid: number}}>, reply: FastifyReply) => {
    const {categoryid} = req.params;
    const products: CategoryProduct[] = await getCategoryProductList(categoryid);
    reply.send(products);
  });
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const categories = await getCategoryList();
    reply.send(categories);
  });
  fastify.put("/sortno", async (req: FastifyRequest<{Body: {categories: {id: number; sortno: number}[]}}>, reply: FastifyReply) => {
    const {categories} = req.body;
    const result = await editBatchCategories(categories);
    reply.send(result);
  });
  fastify.put("/useyn", async (req: FastifyRequest<{Body: {categories: {id: number; useyn: string}[]}}>, reply: FastifyReply) => {
    const {categories} = req.body;
    const result = await editBatchCategories(categories);
    reply.send(result);
  });
}
