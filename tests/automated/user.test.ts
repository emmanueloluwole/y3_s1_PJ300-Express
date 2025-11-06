import request from "supertest";

import { app } from "../../src/index";


describe("User API", () => {
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


  it("should fail with invalid email", async () => {
    const res = await request(app).post("/api/v1/users").send({
      fullName: "Bad Email",
      email: "not@jbgu",
      passwordHash: "secure123",
      address: "Test Street",
      phoneNumber: "1234567890",
      role: "customer"
    });
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 for non-existent user", async () => {
    const res = await request(app).get("/api/v1/users/000000000000000000000000");
    expect(res.statusCode).toBe(404);
  });
});
