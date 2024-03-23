import { GetCategoryByIdService } from "../services/GetCategoryByIdService";

jest.mock("@prisma/client", () => {
  const mockFindUnique = jest.fn((data) => {
    if (data.where.id === "notfound") {
      return Promise.resolve(null);
    } else if (data.where.id === "dberror") {
      return Promise.reject(new Error("Database error"));
    } else {
      return Promise.resolve({ id: data.where.id, title: "Test Title", description: "Test Description" });
    }
  });

  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        categories: {
          findUnique: mockFindUnique,
        },
      };
    }),
    mockFindUnique,
  };
});

const { mockFindUnique, PrismaClient } = require("@prisma/client");

describe("GetCategoryByIdService", () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  it("should get a category by id", async () => {
    const service = new GetCategoryByIdService();
    const result = await service.execute({ id: "test" });

    expect(mockFindUnique).toBeCalledWith({
      where: {
        id: "test",
      },
    });
    expect(result).toEqual({ id: "test", title: "Test Title", description: "Test Description" });
  });

  it("should throw an error if id is not provided", async () => {
    const service = new GetCategoryByIdService();

    await expect(service.execute({ id: "" })).rejects.toThrow("Id is required");
  });

  it("should throw an error if category is not found", async () => {
    const service = new GetCategoryByIdService();

    await expect(service.execute({ id: "notfound" })).rejects.toEqual({ id: "notfound", message: 'Category not found' });
  });

  it("should throw an error if the database operation fails", async () => {
    const service = new GetCategoryByIdService();

    await expect(service.execute({ id: "dberror" })).rejects.toThrow("Database error");
  });
});