import { FastifyRequest, FastifyReply } from "fastify";
import { EditCategoryService } from "../services/EditCategoryService";
import prisma from "../prisma";

class EditCategoryController {
  private async editCategory({ id, title, description }: { id: string; title: string; description: string }) {
    const editCategoryService = new EditCategoryService(prisma);
    return await editCategoryService.execute({ id: String(id), title, description });
  }

  private sendSuccessResponse(reply: FastifyReply, data: any) {
    reply.send(data);
  }

  private sendErrorResponse(reply: FastifyReply, error: Error) {
    reply.code(500).send({ error: error.message });
  }

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id, title, description } = request.body as { id: string; title: string; description: string };

    try {
      const updatedCategory = await this.editCategory({ id, title, description });
      this.sendSuccessResponse(reply, updatedCategory);
    } catch (error) {
      if (error instanceof Error) {
        this.sendErrorResponse(reply, error);
      }
    }
  }
}

export { EditCategoryController };
