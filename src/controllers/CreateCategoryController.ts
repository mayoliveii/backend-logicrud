import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCategoryService } from "../services/CreateCategoryService";
import prisma from "prisma";

class CreateCategoryController {
  private async createCategory({ title, description }: { title: string; description: string }) {
    const createCategoryService = new CreateCategoryService(prisma);
    return await createCategoryService.execute({ title, description });
  }

  private sendSuccessResponse(reply: FastifyReply, data: any) {
    reply.send(data);
  }

  private sendErrorResponse(reply: FastifyReply, statusCode: number, message: string) {
    reply.code(statusCode).send({ error: message });
  }

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { title, description } = request.body as { title: string; description: string };

    try {
      const result = await this.createCategory({ title, description });
      this.sendSuccessResponse(reply, result);
    } catch (error) {
      if (error instanceof Error) {
        this.sendErrorResponse(reply, 500, error.message);
      } else {
        this.sendErrorResponse(reply, 500, "Failed to create category");
      }
    }
  }
}

export { CreateCategoryController };