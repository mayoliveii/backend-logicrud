import { CreateCategoryService } from "../services/CreateCategoryService";

jest.mock("@prisma/client", () => {
  const mockCreate = jest.fn((data) => {
    if (data.data.title === "Error") {
      return Promise.reject(new Error("Database error"));
    } else {
      return Promise.resolve(data);
    }
  });

  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        categories: {
          create: mockCreate,
        },
      };
    }),
    mockCreate,
  };
});

const { PrismaClient, mockCreate } = require("@prisma/client");

describe("CreateCategoryService", () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  it("should create a new category", async () => {
    const service = new CreateCategoryService(prisma);

    const category = await service.execute({
      title: "Test Category",
      description: "Test Description",
    });

    expect(mockCreate).toBeCalledWith({
      data: {
        title: "Test Category",
        description: "Test Description",
      },
    });
    expect(category).toEqual(expect.any(Object));
  });

  it("should create a new category", async () => {
    const service = new CreateCategoryService(prisma);

    await expect(
      service.execute({
        title: "",
        description: "Test Description",
      })
    ).rejects.toThrow("Title and description are required");

    await expect(
      service.execute({
        title: "Test Category",
        description: "",
      })
    ).rejects.toThrow("Title and description are required");
  });

  it("should throw an error if the database operation fails", async () => {
    const service = new CreateCategoryService(prisma);

    await expect(
      service.execute({
        title: "Error",
        description: "Test Description",
      })
    ).rejects.toThrow("Failed to create category: Database error");
  });
});