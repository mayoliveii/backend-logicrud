import { PrismaClient } from "@prisma/client";
import { FastifyReply } from "fastify";

interface ListCategoriesProps {
  orderBy?: 'created_at_ASC' | 'created_at_DESC' | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  search?: string | undefined;
}

class ListCategoriesService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async execute({ orderBy, startDate, endDate, search }: ListCategoriesProps, reply: FastifyReply) {
    try {
      const categories = await this.prisma.categories.findMany({
        where: {
          created_at: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined,
          },
          AND: search
            ? {
              OR: [
                { title: { contains: search } },
                { description: { contains: search } },
              ],
            }
            : undefined,
        },
        orderBy: orderBy
          ? {
            created_at: orderBy === 'created_at_ASC' ? 'asc' : 'desc',
          }
          : undefined,
      });

      return categories;
    } catch (error: any) {
      reply.code(500).send({ error: `Failed to list categories. Error details: ${error.message}` });
    }
  }

}

export { ListCategoriesService };
