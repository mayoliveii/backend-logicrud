import { FastifyRequest, FastifyReply } from "fastify";
import { ListCategoriesController } from "../controllers/ListCategoriesController";

const mockExecute = jest.fn((data, reply) => {
  if (data.search === "error") {
    throw new Error("Test error");
  } else {
    return Promise.resolve([{ id: "1", title: "Test Title", description: "Test Description" }]);
  }
});

jest.mock("../services/ListCategoriesService", () => {
  return {
    ListCategoriesService: jest.fn().mockImplementation(() => {
      return {
        execute: mockExecute,
      };
    }),
  };
});

describe("ListCategoriesController", () => {
  beforeEach(() => {
    mockExecute.mockClear();
  });
  it("should list categories", async () => {
    const controller = new ListCategoriesController();
    const request = { query: { orderBy: "created_at_ASC", startDate: "2022-01-01", endDate: "2022-12-31", search: "Test" } } as FastifyRequest;
    const reply = { send: jest.fn(), code: jest.fn().mockReturnThis() } as unknown as FastifyReply;

    await controller.handle(request, reply);

    expect(mockExecute).toBeCalledWith({ orderBy: "created_at_ASC", startDate: "2022-01-01", endDate: "2022-12-31", search: "Test" }, reply);
    expect(reply.send).toBeCalledWith([{ id: "1", title: "Test Title", description: "Test Description" }]);
  });

  it("should handle errors", async () => {
    const controller = new ListCategoriesController();
    const request = { query: { search: "error" } } as FastifyRequest;
    const reply = { send: jest.fn(), code: jest.fn().mockReturnThis() } as unknown as FastifyReply;

    await controller.handle(request, reply);

    expect(mockExecute).toBeCalledWith({ search: "error" }, reply);
    expect(reply.code).toBeCalledWith(500);
    expect(reply.send).toBeCalledWith({ error: "Failed to list categories" });
  });
});