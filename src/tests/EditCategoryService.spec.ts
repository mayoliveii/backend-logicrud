import { EditCategoryService } from "../services/EditCategoryService";

jest.mock("@prisma/client", () => {
  const mockFindFirst = jest.fn((data) => {
    if (data.where.id === "notfound") {
      return Promise.resolve(null);
    } else if (data.where.id === "dberror") {
      return Promise.reject(new Error("Database error"));
    } else {
      return Promise.resolve({ id: data.where.id, title: "Old Title", description: "Old Description" });
    }
  });

  const mockUpdate = jest.fn((data) => {
    return Promise.resolve({ id: data.where.id, title: "New Title", description: "New Description" });
  });

  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        categories: {
          findFirst: mockFindFirst,
          update: mockUpdate,
        },
      };
    }),
    mockFindFirst,
    mockUpdate,
  };
});

const { mockFindFirst, mockUpdate, PrismaClient } = require("@prisma/client");

describe("EditCategoryService", () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  it("should edit a category", async () => {
    const service = new EditCategoryService(prisma);
    const result = await service.execute({ id: "test", title: "New Title", description: "New Description" });

    expect(mockFindFirst).toBeCalledWith({
      where: {
        id: "test",
      },
    });
    expect(mockUpdate).toBeCalledWith({
      where: {
        id: "test",
      },
      data: {
        title: "New Title",
        description: "New Description",
        updated_at: expect.any(Date),
      },
    });
    expect(result).toEqual({ id: "test", title: "New Title", description: "New Description" });
  });

  it("should throw an error if id, title or description is not provided", async () => {
    const service = new EditCategoryService(prisma);

    await expect(service.execute({ id: "", title: "", description: "" })).rejects.toThrow("Id, title, and description are required");
  });

  it("should throw an error if category is not found", async () => {
    const service = new EditCategoryService(prisma);

    await expect(service.execute({ id: "notfound", title: "New Title", description: "New Description" })).rejects.toThrow("Category not found");
  });

  it("should throw an error if the database operation fails", async () => {
    const service = new EditCategoryService(prisma);

    await expect(service.execute({ id: "dberror", title: "New Title", description: "New Description" })).rejects.toThrow("Database error");
  });
});