import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CategoryProps {
  title: string;
  description: string;
}

class CreateCategoryService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async execute({ title, description }: CategoryProps) {
    if (!title || !description) {
      throw new Error("Title and description are required");
    }

    try {
      const category = await prisma.categories.create({
        data: {
          title,
          description,
        },
      });

      return category;
    } catch (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }
  }
}

export { CreateCategoryService };