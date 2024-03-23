import { PrismaClient } from "@prisma/client";

interface EditCategoryProps {
  id: string;
  title: string;
  description: string;
}

class EditCategoryService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async execute({ id, title, description }: EditCategoryProps) {
    if (!id && !title || !description) {
      throw new Error("Id, title, and description are required");
    }

    const finderCategory = await this.prisma.categories.findFirst({
      where: {
        id: id,
      },
    });

    if (!finderCategory) {
      throw new Error("Category not found");
    }

    const updatedCategory = await this.prisma.categories.update({
      where: {
        id: finderCategory.id,
      },
      data: {
        title,
        description,
        updated_at: new Date(),
      },
    });

    return updatedCategory;
  }
}

export { EditCategoryService };
