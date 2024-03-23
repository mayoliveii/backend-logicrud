import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCategoryController } from "../controllers/CreateCategoryController";

const mockExecute = jest.fn((data) => {
  if (data.title === "error") {
    throw new Error("Test error");
  } else {
    return Promise.resolve({ id: "1", title: data.title, description: data.description });
  }
});

jest.mock("../services/CreateCategoryService", () => {
  return {
    CreateCategoryService: jest.fn().mockImplementation(() => {
      return {
        execute: mockExecute,
      };
    }),
  };
});

describe("CreateCategoryController", () => {
  it("should create a category", async () => {
    const controller = new CreateCategoryController();
    const request = { body: { title: "Test Title", description: "Test Description" } } as FastifyRequest;
    const reply = { send: jest.fn(), code: jest.fn().mockReturnThis() } as unknown as FastifyReply;

    await controller.handle(request, reply);

    expect(mockExecute).toBeCalledWith({ title: "Test Title", description: "Test Description" });
    expect(reply.send).toBeCalledWith({ id: "1", title: "Test Title", description: "Test Description" });
  });

  it("should handle errors", async () => {
    const controller = new CreateCategoryController();
    const request = { body: { title: "error", description: "Test Description" } } as FastifyRequest;
    const reply = { send: jest.fn(), code: jest.fn().mockReturnThis() } as unknown as FastifyReply;

    await controller.handle(request, reply);

    expect(mockExecute).toBeCalledWith({ title: "error", description: "Test Description" });
    expect(reply.code).toBeCalledWith(500);
    expect(reply.send).toBeCalledWith({ error: "Test error" });
  });

  it("should handle non-Error exceptions", async () => {
    mockExecute.mockImplementationOnce(() => {
      throw "Test exception";
    });

    const controller = new CreateCategoryController();
    const request = { body: { title: "Test Title", description: "Test Description" } } as FastifyRequest;
    const reply = { send: jest.fn(), code: jest.fn().mockReturnThis() } as unknown as FastifyReply;

    await controller.handle(request, reply);

    expect(mockExecute).toBeCalledWith({ title: "Test Title", description: "Test Description" });
    expect(reply.code).toBeCalledWith(500);
    expect(reply.send).toBeCalledWith({ error: "Failed to create category" });
  });
});