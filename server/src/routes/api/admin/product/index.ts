import Product from "@product/entity/Product";
import {addProduct, editProduct, getProductList, getProductInfo, removeProduct, editProductSortno} from "@product/service/productService";
import {FastifyReply, FastifyRequest} from "fastify";
import {FastifyInstance} from "fastify";
import {DeleteResult, UpdateResult} from "typeorm";
import {pipeline} from "stream";
import util from "util";
import fs from "fs";
import path from "path";
import {uuid} from "@utils/UUIDUtils";

const pump = util.promisify(pipeline);

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (_req: FastifyRequest, reply: FastifyReply) => {
    const products: Product[] = await getProductList();
    reply.send(products);
  });

  fastify.get("/:productid", async (req: FastifyRequest<{Params: {productid: number}}>, reply: FastifyReply) => {
    const {productid} = req.params;
    const product = await getProductInfo(Number(productid));
    reply.send(product);
  });

  fastify.post(
    "/",
    async (
      req: FastifyRequest<{
        Body: {
          categoryids: number[];
          price: number;
          productname: string;
          stock: number;
          showyn: string;
          content?: string;
          description?: string;
          thumbnail?: string;
          images?: string[];
          details?: any[];
        };
      }>,
      reply: FastifyReply,
    ) => {
      const result = await addProduct(req.body);
      reply.send(result);
    },
  );

  fastify.post("/upload", async (req: FastifyRequest, reply: FastifyReply) => {
    const file = await req.file();
    if (!file) {
      return reply.code(400).send({message: "NO_FILE"});
    }
    const fileid = uuid();
    const imgRoot = path.resolve("public", "product", "images");
    fs.mkdirSync(imgRoot, {recursive: true});
    const rawName = path.basename(file.filename || "image").replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "image";
    const filename = `${fileid}_${rawName}`;
    const dest = path.resolve(imgRoot, filename);
    if (dest !== imgRoot && !dest.startsWith(imgRoot + path.sep)) {
      return reply.code(400).send({message: "INVALID_FILENAME"});
    }
    await pump(file.file, fs.createWriteStream(dest));
    reply.send({path: `/product/images/${filename}`});
  });

  fastify.put("/", async (req: FastifyRequest<{Body: {
    id: number;
    title?: string;
    description?: string;
    thumbnail?: string;
    cost?: number;
    capacity?: number;
    optionCnt?: number;
    showyn?: string;
    editor?: string;
    images?: string[];
  }}>, reply: FastifyReply) => {
    const result: UpdateResult = await editProduct(req.body);
    reply.send(result);
  });

  fastify.put("/sortno", async (req: FastifyRequest<{Body: {products: {id: number; showyn: string}[]}}>, reply: FastifyReply) => {
    const {products} = req.body;
    const result = await editProductSortno(products);
    reply.send(result);
  });

  fastify.delete("/:productid", async (req: FastifyRequest<{Params: {productid: number}}>, reply: FastifyReply) => {
    const {productid} = req.params;
    const result: DeleteResult = await removeProduct(Number(productid));
    reply.send(result);
  });
}
