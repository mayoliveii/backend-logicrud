import { FastifyRequest, FastifyReply } from "fastify";
import { DeleteCategoryController } from "../controllers/DeleteCategoryController";

const mockExecute = jest.fn((data) => {
  if (data.id === "error") {
    throw new Error("Test error");
  } else {
    return Promise.resolve({ id: data.id });
  }
});

jest.mock("../services/DeleteCategoryService", () => {
  return {
    DeleteCategoryService: jest.fn().mockImplementation(() => {
      return {
        execute: mockExecute,
      };
    }),
  };
});

describe("DeleteCategoryController", () => {
  it("should delete a category", async () => {
    const controller = new DeleteCategoryController();
    const request = { body: { id: "1" } } as FastifyRequest;
    const reply = { send: jest.fn(), code: jest.fn().mockReturnThis() } as unknown as FastifyReply;

    await controller.handle(request, reply);

    expect(mockExecute).toBeCalledWith({ id: "1" });
    expect(reply.send).toBeCalledWith({ id: "1" });
  });

  it("should handle errors", async () => {
    const controller = new DeleteCategoryController();
    const request = { body: { id: "error" } } as FastifyRequest;
    const reply = { send: jest.fn(), code: jest.fn().mockReturnThis() } as unknown as FastifyReply;

    await controller.handle(request, reply);

    expect(mockExecute).toBeCalledWith({ id: "error" });
    expect(reply.code).toBeCalledWith(500);
    expect(reply.send).toBeCalledWith({ id: "error", error: "Test error" });
  });

  it("should handle non-Error exceptions", async () => {
    mockExecute.mockImplementationOnce(() => {
      throw "Test exception";
    });

    const controller = new DeleteCategoryController();
    const request = { body: { id: "1" } } as FastifyRequest;
    const reply = { send: jest.fn(), code: jest.fn().mockReturnThis() } as unknown as FastifyReply;

    await controller.handle(request, reply);

    expect(mockExecute).toBeCalledWith({ id: "1" });
    expect(reply.code).toBeCalledWith(500);
    expect(reply.send).toBeCalledWith({ id: "1", error: "Failed to delete category" });
  });
});