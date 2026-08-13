import Product from "@product/entity/Product";
import {addProduct, editProduct, getProductList, getProductInfo, removeProduct, editProductSortno} from "@product/service/productService";
import {FastifyReply, FastifyRequest} from "fastify";
import {FastifyInstance} from "fastify";
import {DeleteResult, UpdateResult} from "typeorm";
import {pipeline} from "stream";
import util from "util";
import fs from "fs";
import {uuid} from "@utils/UUIDUtils";
const pump = util.promisify(pipeline);

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const products: Product[] = await getProductList();
    reply.send(products);
  });
  fastify.get("/:productid", async (req: FastifyRequest<{Params: {productid: number}}>, reply: FastifyReply) => {
    const {productid} = req.params;
    const products: Product | null = await getProductInfo(productid);
    reply.send(products);
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
          content: string;
          newfilelist: string[];
          delfilelist: string[];
          details: any[];
          description: string;
          thumbnail: string;
          images: string[];
        };
      }>,
      reply: FastifyReply,
    ) => {
      const params = req.body;

      // reply.send(result);
      console.log("product >>", params);
      const result: Product = await addProduct(params);

      reply.send("hghi");
    },
  );
  fastify.post("/test", async (req: FastifyRequest<{Params: {categoryid: number}; Body: Product}>, reply: FastifyReply) => {
    const result = "text";
    const parts = req.files();
    console.log("parts >>", parts);
    let i = 0;
    for await (const part of parts) {
      const mimetype = part.mimetype;
      const filename = part.filename;
      const fileid = uuid();
      console.log("parts >>", i, filename, mimetype, part, fileid);
      const img_root = "public/product";
      const thumb_path = img_root + "/thumb";
      const img_path = img_root + "/images";
      if (i == 0) {
        await pump(part.file, fs.createWriteStream(thumb_path + "/" + fileid));
      } else {
        await pump(part.file, fs.createWriteStream(img_path + "/" + fileid));
      }
      i++;
    }

    // console.log("req.isMultipart >>", req.isMultipart());
    // console.log(" >>result ", result, req.params, req.body);
    // const files = await req.files();
    // console.log(" >>files ", files);

    // const file = await req.file();
    // console.log("file >", file);
    // const fileaa = await req.saveRequestFiles();
    // console.log(" >>fileaa ", fileaa);
    // const parts = req.parts();
    // console.log(" >>parts ", parts);
    // for await (const part of parts) {
    //   console.log(" >>parts ", parts);
    //   await pump(part.file, fs.createWriteStream(part.filename));
    // }

    reply.send(result);
  });

  fastify.put("/", async (req: FastifyRequest<{Params: {categoryid: number}; Body: Product}>, reply: FastifyReply) => {
    const product: Product = req.body;
    const result: UpdateResult = await editProduct(product);
    reply.send(result);
  });
  fastify.put("/sortno", async (req: FastifyRequest<{Body: {products: {id: number; showyn: string}[]}}>, reply: FastifyReply) => {
    const {products} = req.body;
    console.log("products >", products);
    const result = await editProductSortno(products);
    reply.send(result);
  });

  fastify.delete("/:productid", async (req: FastifyRequest<{Params: {categoryid: number; productid: number}}>, reply: FastifyReply) => {
    const {productid} = req.params;
    const result: DeleteResult = await removeProduct(productid);
    reply.send(result);
  });
}
