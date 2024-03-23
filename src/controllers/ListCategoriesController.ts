import { FastifyRequest, FastifyReply } from "fastify";
import { ListCategoriesService } from "../services/ListCategoriesService";

class ListCategoriesController {
  private listCategoriesService: ListCategoriesService;

  constructor() {
    this.listCategoriesService = new ListCategoriesService();
  }

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { orderBy, startDate, endDate, search } = request.query as {
        orderBy?: 'created_at_ASC' | 'created_at_DESC' | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        search?: string | undefined;
      };

      const result = await this.listCategoriesService.execute({ orderBy, startDate, endDate, search }, reply);
      reply.send(result);
    } catch (error) {
      reply.code(500).send({ error: "Failed to list categories" });
    }
  }
}

export { ListCategoriesController };
