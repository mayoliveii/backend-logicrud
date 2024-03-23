import { FastifyRequest, FastifyReply } from "fastify";
import { GetCategoryByIdService } from "../services/GetCategoryByIdService";

class GetCategoryByIdController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.body as { id: string };

    try {
      if (!id) {
        throw new Error('Id is required');
      }

      const getCategoryByIdService = new GetCategoryByIdService();
      const result = await getCategoryByIdService.execute({ id });

      reply.send(result);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to get category by id";
      reply.code(500).send({ id, error: errorMessage });
    }
  }
}

export { GetCategoryByIdController };