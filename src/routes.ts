import { FastifyInstance, FastifyRequest, FastifyReply, FastifyPluginOptions } from "fastify";
import { CreateCategoryController } from "./controllers/CreateCategoryController";
import { ListCategoriesController } from "./controllers/ListCategoriesController";
import { EditCategoryController } from "./controllers/EditCategoryController";
import { DeleteCategoryController } from "controllers/DeleteCategoryController";
import { GetCategoryByIdController } from "controllers/GetCategoryByIdController";

export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {

  fastify.post("/create-category", async (request: FastifyRequest, reply: FastifyReply) => {
    return new CreateCategoryController().handle(request, reply);
  });

  fastify.get("/list-categories", async (request: FastifyRequest, reply: FastifyReply) => {
    return new ListCategoriesController().handle(request, reply);
  });

  fastify.delete("/delete-category", async (request: FastifyRequest, reply: FastifyReply) => {
    return new DeleteCategoryController().handle(request, reply);
  });

  fastify.post("/edit-category", async (request: FastifyRequest, reply: FastifyReply) => {
    return new EditCategoryController().handle(request, reply);
  });

  fastify.post("/get-category-by-id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new GetCategoryByIdController().handle(request, reply);
  });
}