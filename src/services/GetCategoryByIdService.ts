import prismaClient from '../prisma';

interface GetCategoryByIdProps {
  id: string;
}

class GetCategoryByIdService {
  async execute({ id }: GetCategoryByIdProps) {
    if (!id) {
      throw new Error('Id is required');
    }

    const foundCategory = await prismaClient.categories.findUnique({
      where: {
        id,
      },
    });

    if (!foundCategory) {
      throw { id, message: 'Category not found' };
    }

    return foundCategory;
  }
}

export { GetCategoryByIdService };