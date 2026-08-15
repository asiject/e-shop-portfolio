import {uuid} from "@utils/UUIDUtils";
import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";
import {pipeline} from "stream";
import util from "util";
import fs from "fs";
import {addTempFile} from "@file/service/FileTempService";
const pump = util.promisify(pipeline);

export default async function (fastify: FastifyInstance) {
  // 장바구니 > 데이터 저장 > 주문하기(uuid로 조회)
  fastify.post("/", async (req: FastifyRequest<{Body: {filetype: any; file: any}}>, reply: FastifyReply) => {
    const filetype = req.body.filetype.value;
    const parts = req.body.file;
    const isMulti = req.body.file?.length ? true : false;
    const fileresult = [];
    let sortno = 1;
    if (isMulti) {
      for (const part of parts) {
        const fileid = await makefile(part, filetype, sortno++);
        fileresult.push(fileid);
      }
    } else {
      const filedata = await makefile(parts, filetype, 1);
      fileresult.push(filedata);
    }
    reply.send({files: fileresult, filetype});
  });

  async function makefile(part: any, filetype: string, sortno: number) {
    const mimetype = part.mimetype;
    const filename = part.filename;
    const fileid = uuid();
    const img_root = "public/temp";
    const filepath = img_root + "/" + filetype;
    const filesize = part.file.bytesRead;
    await addTempFile(fileid, filename, filepath, filesize, mimetype, filetype, sortno);
    await pump(part.file, fs.createWriteStream(filepath + "/" + fileid));
    return {fileid, filename};
  }
}
