import Category from "@category/entity/Category";
import category from "@routes/api/category";
import {
  addCategory,
  editCategoryUseYn,
  getCategoryById,
  getCategoryList,
  getCategoryListByType,
  getCategoryProductsById,
  removeCategory,
} from "@category/service/categoryService";
import {FastifyReply} from "fastify";
import {FastifyRequest} from "fastify";
import {FastifyInstance} from "fastify";
import categoryProduct from "./categoryProduct";

export default async function (fastify: FastifyInstance) {
  fastify.register(categoryProduct, {prefix: "/:categoryid/product"});

  fastify.get("/:id/products", async (req: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply) => {
    const {id} = req.params;
    const category = await getCategoryProductsById(id);
    reply.send(category);
  });
  fastify.get("/:id/duplicate", async (req: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply) => {
    const {id} = req.params;
    const category = await getCategoryById(id);
    reply.send(category);
  });
  fastify.put("/:id/useyn", async (req: FastifyRequest<{Params: {id: number}; Body: {useyn: string}}>, reply: FastifyReply) => {
    const {id} = req.params;
    const {useyn} = req.body;
    const category = await editCategoryUseYn(id, useyn);
    reply.send(category);
  });
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const categories: Category[] = await getCategoryList();
    reply.send(categories);
  });
  fastify.post("/", async (req: FastifyRequest<{Body: Category}>, reply: FastifyReply) => {
    const categoryVO = req.body;
    console.log("category >>", categoryVO);
    const category = await addCategory(categoryVO);
    console.log("category >>", categoryVO, category);
    reply.send(category);
  });
  fastify.delete("/:id", async (req: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply) => {
    const {id} = req.params;
    const category = await removeCategory(id);
    reply.send(category);
  });

  fastify.get("/type/:typeid", async (req: FastifyRequest<{Params: {typeid: string}}>, reply: FastifyReply) => {
    const {typeid} = req.params;
    console.log("typeid >", typeid);
    const categories: Category[] = await getCategoryListByType(typeid);
    reply.send(categories);
  });
}
