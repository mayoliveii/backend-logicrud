import { FastifyRequest, FastifyReply } from "fastify";
import { EditCategoryController } from "../controllers/EditCategoryController";

const mockExecute = jest.fn((data) => {
  if (data.id === "error") {
    throw new Error("Test error");
  } else {
    return Promise.resolve({ id: data.id, title: data.title, description: data.description });
  }
});

jest.mock("../services/EditCategoryService", () => {
  return {
    EditCategoryService: jest.fn().mockImplementation(() => {
      return {
        execute: mockExecute,
      };
    }),
  };
});

describe("EditCategoryController", () => {
  it("should edit a category", async () => {
    const controller = new EditCategoryController();
    const request = { body: { id: "1", title: "Test Title", description: "Test Description" } } as FastifyRequest;
    const reply = { send: jest.fn(), code: jest.fn().mockReturnThis() } as unknown as FastifyReply;

    await controller.handle(request, reply);

    expect(mockExecute).toBeCalledWith({ id: "1", title: "Test Title", description: "Test Description" });
    expect(reply.send).toBeCalledWith({ id: "1", title: "Test Title", description: "Test Description" });
  });

  it("should handle errors", async () => {
    const controller = new EditCategoryController();
    const request = { body: { id: "error", title: "Test Title", description: "Test Description" } } as FastifyRequest;
    const reply = { send: jest.fn(), code: jest.fn().mockReturnThis() } as unknown as FastifyReply;

    await controller.handle(request, reply);

    expect(mockExecute).toBeCalledWith({ id: "error", title: "Test Title", description: "Test Description" });
    expect(reply.code).toBeCalledWith(500);
    expect(reply.send).toBeCalledWith({ error: "Test error" });
  });
});