import prismaClient from '../prisma';

interface DeleteCategoryProps {
  id: string;
}

class DeleteCategoryService {
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
