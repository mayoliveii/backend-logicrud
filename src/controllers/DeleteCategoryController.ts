import { FastifyRequest, FastifyReply } from "fastify";
import { DeleteCategoryService } from "../services/DeleteCategoryService";
import prisma from "prisma";

class DeleteCategoryController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.body as { id: string };
    const deleteCategoryService = new DeleteCategoryService(prisma);

    try {
      const result = await deleteCategoryService.execute({ id });
      reply.send(result);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to delete category";
      reply.code(500).send({ id, error: errorMessage });
    }
  }
}

export { DeleteCategoryController };