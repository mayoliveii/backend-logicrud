import { FastifyRequest, FastifyReply } from "fastify";
import { GetCategoryByIdController } from "../controllers/GetCategoryByIdController";

const mockExecute = jest.fn((data) => {
  if (data.id === "error") {
    throw new Error("Test error");
  } else if (!data.id) {
    throw new Error("Id is required");
  } else {
    return Promise.resolve({ id: data.id, title: "Test Title", description: "Test Description" });
  }
});

jest.mock("../services/GetCategoryByIdService", () => {
  return {
    GetCategoryByIdService: jest.fn().mockImplementation(() => {
      return {
        execute: mockExecute,
      };
    }),
  };
});

describe("GetCategoryByIdController", () => {
  beforeEach(() => {
    mockExecute.mockClear();
  });
  it("should get a category by id", async () => {
    const controller = new GetCategoryByIdController();
    const request = { body: { id: "1" } } as FastifyRequest;
    const reply = { send: jest.fn(), code: jest.fn().mockReturnThis() } as unknown as FastifyReply;

    await controller.handle(request, reply);

    expect(mockExecute).toBeCalledWith({ id: "1" });
    expect(reply.send).toBeCalledWith({ id: "1", title: "Test Title", description: "Test Description" });
  });

  it("should handle errors", async () => {
    const controller = new GetCategoryByIdController();
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

    const controller = new GetCategoryByIdController();
    const request = { body: { id: "1" } } as FastifyRequest;
    const reply = { send: jest.fn(), code: jest.fn().mockReturnThis() } as unknown as FastifyReply;

    await controller.handle(request, reply);

    expect(mockExecute).toBeCalledWith({ id: "1" });
    expect(reply.code).toBeCalledWith(500);
    expect(reply.send).toBeCalledWith({ id: "1", error: "Failed to get category by id" });
  });

  it("should handle missing id", async () => {
    const controller = new GetCategoryByIdController();
    const request = { body: { id: "" } } as FastifyRequest;
    const reply = { send: jest.fn(), code: jest.fn().mockReturnThis() } as unknown as FastifyReply;

    await controller.handle(request, reply);

    expect(reply.code).toBeCalledWith(500);
    expect(reply.send).toBeCalledWith({ id: "", error: "Id is required" });
  });
});