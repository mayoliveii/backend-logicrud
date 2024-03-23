import { FastifyReply } from "fastify";
import { ListCategoriesService } from "../services/ListCategoriesService";

jest.mock("@prisma/client", () => {
  const mockFindMany = jest.fn(() => {
    return Promise.resolve([
      { id: "1", title: "Test Title 1", description: "Test Description 1" },
      { id: "2", title: "Test Title 2", description: "Test Description 2" },
    ]);
  });

  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        categories: {
          findMany: mockFindMany,
        },
      };
    }),
    mockFindMany,
  };
});

const { mockFindMany, PrismaClient } = require("@prisma/client");

describe("ListCategoriesService", () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  it("should list categories", async () => {
    const service = new ListCategoriesService();
    const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply;
    const result = await service.execute({ orderBy: 'created_at_ASC', startDate: "2022-01-01", endDate: "2022-12-31", search: "Test" }, reply);

    expect(mockFindMany).toBeCalled();
    expect(result).toEqual([
      { id: "1", title: "Test Title 1", description: "Test Description 1" },
      { id: "2", title: "Test Title 2", description: "Test Description 2" },
    ]);
  });

  it("should handle errors", async () => {
    const service = new ListCategoriesService();
    const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply;
    mockFindMany.mockRejectedValueOnce(new Error("Database error"));

    await service.execute({ orderBy: 'created_at_ASC', startDate: "2022-01-01", endDate: "2022-12-31", search: "Test" }, reply);

    expect(reply.code).toBeCalledWith(500);
    expect(reply.send).toBeCalledWith({ error: "Failed to list categories. Error details: Database error" });
  });
  it("should list categories without any filters or ordering", async () => {
    const service = new ListCategoriesService();
    const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply;
    const result = await service.execute({}, reply);

    expect(mockFindMany).toBeCalledWith({
      where: {
        created_at: {
          gte: undefined,
          lte: undefined,
        },
        AND: undefined,
      },
      orderBy: undefined,
    });
    expect(result).toEqual([
      { id: "1", title: "Test Title 1", description: "Test Description 1" },
      { id: "2", title: "Test Title 2", description: "Test Description 2" },
    ]);
  });

  it("should list categories ordered by 'created_at_DESC'", async () => {
    const service = new ListCategoriesService();
    const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply;
    const result = await service.execute({ orderBy: 'created_at_DESC' }, reply);

    expect(mockFindMany).toBeCalledWith({
      where: {
        created_at: {
          gte: undefined,
          lte: undefined,
        },
        AND: undefined,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    expect(result).toEqual([
      { id: "1", title: "Test Title 1", description: "Test Description 1" },
      { id: "2", title: "Test Title 2", description: "Test Description 2" },
    ]);
  });
});