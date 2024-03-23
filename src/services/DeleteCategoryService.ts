import { PrismaClient } from '@prisma/client';
import prismaClient from '../prisma';

const prisma = new PrismaClient();

interface DeleteCategoryProps {
  id: string;
}

class DeleteCategoryService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async execute({ id }: DeleteCategoryProps) {
    if (!id) {
      throw new Error('Id is required');
    }

    const foundCategories = await prismaClient.categories.findUnique({
      where: {
        id,
      },
    });

    if (!foundCategories) {
      throw { id, message: 'Category not found' };
    }

    await prismaClient.categories.delete({
      where: {
        id,
      },
    });

    return { id, message: 'Category deleted successfully' };
  }
}

export { DeleteCategoryService };
