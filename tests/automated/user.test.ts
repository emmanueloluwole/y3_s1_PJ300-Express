import request from "supertest";
import { app } from "../../src/index";

describe("User API", () => {
  // 1. Create a valid user and immediately check response
  it("should create a user", async () => {
    const res = await request(app).post("/api/v1/users").send({
      fullName: "Test User",
      email: "test@example.com",
      passwordHash: "secure123",
      address: "Test Street",
      phoneNumber: "+353871234567",
      role: "customer"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.insertedId).toBeDefined();
  });

  // 2. Create a user and then fetch it by ID
  it("should create and fetch a user", async () => {
    const createRes = await request(app).post("/api/v1/users").send({
      fullName: "Fetch User",
      email: "fetch@example.com",
      passwordHash: "secure123",
      address: "Fetch Street",
      phoneNumber: "+353871234568",
      role: "customer"
    });

    expect(createRes.statusCode).toBe(201);
    const id = createRes.body.insertedId;

    const getRes = await request(app).get(`/api/v1/users/${id}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.fullName).toBe("Fetch User");
  });

  // 3. Fail with invalid email
  it("should fail with invalid email", async () => {
    const res = await request(app).post("/api/v1/users").send({
      fullName: "Bad Email",
      email: "not-an-email",
      passwordHash: "secure123",
      address: "Test Street",
      phoneNumber: "+353871234569",
      role: "customer"
    });

    expect(res.statusCode).toBe(400);
  });

  // 4. Fail with invalid phone number
  it("should fail with invalid phone number", async () => {
    const res = await request(app).post("/api/v1/users").send({
      fullName: "Bad Phone",
      email: "phone@example.com",
      passwordHash: "secure123",
      address: "Test Street",
      phoneNumber: "1234567890", // ❌ missing +353
      role: "customer"
    });

    expect(res.statusCode).toBe(400);
  });

  // 5. Create and then delete a user
  it("should create and delete a user", async () => {
    const createRes = await request(app).post("/api/v1/users").send({
      fullName: "Delete User",
      email: "delete@example.com",
      passwordHash: "secure123",
      address: "Delete Street",
      phoneNumber: "+353871234570",
      role: "customer"
    });

    expect(createRes.statusCode).toBe(201);
    const id = createRes.body.insertedId;

    const deleteRes = await request(app).delete(`/api/v1/users/${id}`);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.deletedCount).toBe(1);
  });
});
