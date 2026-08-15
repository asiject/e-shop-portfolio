import {answerProductQna, getAllProductQnas} from "@product/service/productQnaService";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (_req: FastifyRequest, reply: FastifyReply) => {
    const list = await getAllProductQnas();
    reply.send(list);
  });

  fastify.put("/:id", async (req: FastifyRequest<{Params: {id: number}; Body: {answer?: string}}>, reply: FastifyReply) => {
    const id = Number(req.params.id);
    const answer = req.body?.answer?.trim();
    if (!id) return reply.code(400).send({message: "INVALID_ID"});
    if (!answer) return reply.code(400).send({message: "EMPTY_ANSWER"});
    const row = await answerProductQna(id, answer);
    if (!row) return reply.code(404).send({message: "QNA_NOT_FOUND"});
    reply.send(row);
  });
}
