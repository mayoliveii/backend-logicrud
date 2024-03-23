import { DeleteCategoryService } from "../services/DeleteCategoryService";

jest.mock("@prisma/client", () => {
  const mockFindUnique = jest.fn((data) => {
    if (data.where.id === "notfound") {
      return Promise.resolve(null);
    } else if (data.where.id === "dberror") {
      return Promise.reject(new Error("Database error"));
    } else {
      return Promise.resolve({ id: data.where.id });
    }
  });

  const mockDelete = jest.fn((data) => {
    return Promise.resolve({ id: data.where.id, message: 'Category deleted successfully' });
  });

  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        categories: {
          findUnique: mockFindUnique,
          delete: mockDelete,
        },
      };
    }),
    mockFindUnique,
    mockDelete,
  };
});

const { mockFindUnique, mockDelete, PrismaClient } = require("@prisma/client");

describe("DeleteCategoryService", () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  it("should delete a category", async () => {
    const service = new DeleteCategoryService(prisma);
    const result = await service.execute({ id: "test" });

    expect(mockFindUnique).toBeCalledWith({
      where: {
        id: "test",
      },
    });
    expect(mockDelete).toBeCalledWith({
      where: {
        id: "test",
      },
    });
    expect(result).toEqual({ id: "test", message: 'Category deleted successfully' });
  });

  it("should throw an error if id is not provided", async () => {
    const service = new DeleteCategoryService(prisma);

    await expect(service.execute({ id: "" })).rejects.toThrow("Id is required");
  });

  it("should throw an error if category is not found", async () => {
    const service = new DeleteCategoryService(prisma);

    await expect(service.execute({ id: "notfound" })).rejects.toEqual({ id: "notfound", message: 'Category not found' });
  });

  it("should throw an error if the database operation fails", async () => {
    const service = new DeleteCategoryService(prisma);

    await expect(service.execute({ id: "dberror" })).rejects.toThrow("Database error");
  });
});