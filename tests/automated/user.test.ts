

// USERS TEST SUITE (80 TESTS TOTAL)


import request from "supertest";
import { app } from "../../src/index";
import { ObjectId } from "mongodb";

describe("User API", () => {
  // Helper user object
  const baseUser = {
    fullName: "Test User",
    email: "test@example.com",
    passwordHash: "secure123",
    address: "Test Street",
    phoneNumber: "+353871234567",
    shopId: "shop-123",              // ✅ REQUIRED
    role: "customer"
  };

  it("(1) should create a user", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send(baseUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.insertedId).toBeDefined();
  });

  it("(2) should create and fetch a user", async () => {
    const create = await request(app)
      .post("/api/v1/users")
      .send({
        ...baseUser,
        fullName: "Fetch User",
        email: "fetch@example.com"
      });

    expect(create.statusCode).toBe(201);

    const id = create.body.insertedId;

    const getRes = await request(app).get(`/api/v1/users/${id}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.fullName).toBe("Fetch User");
  });

  it("(3) should fail invalid email: bad@", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({
        ...baseUser,
        email: "bad@"
      });

    expect(res.statusCode).toBe(400);
  });

  // ============================
  // GET USER BY ID
  // ============================

  it("(28) should get a user by ID", async () => {
    const create = await request(app)
      .post("/api/v1/users")
      .send({
        ...baseUser,
        email: "lookup@example.com"
      });

    const id = create.body.insertedId;

    const res = await request(app).get(`/api/v1/users/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBeDefined();
  });

  it("(29) should fail on invalid ID format", async () => {
    const res = await request(app).get("/api/v1/users/abc123");
    expect(res.statusCode).toBe(400);
  });

  it("(30) should 404 non-existent ID", async () => {
    const fakeId = new ObjectId().toString();
    const res = await request(app).get(`/api/v1/users/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  // ============================
  // UPDATE TESTS
  // ============================

  it("(35) should update email", async () => {
    const create = await request(app)
      .post("/api/v1/users")
      .send({
        ...baseUser,
        email: "to-update@example.com"
      });

    const id = create.body.insertedId;

    const res = await request(app)
      .put(`/api/v1/users/${id}`)
      .send({ email: "updated@example.com" });

    expect(res.statusCode).toBe(200);
  });

  it("(36) should update phone", async () => {
    const create = await request(app)
      .post("/api/v1/users")
      .send({
        ...baseUser,
        email: "phoneupdate@example.com"
      });

    const id = create.body.insertedId;

    const res = await request(app)
      .put(`/api/v1/users/${id}`)
      .send({ phoneNumber: "+353871234570" });

    expect(res.statusCode).toBe(200);
  });

  it("(37) should update address", async () => {
    const create = await request(app)
      .post("/api/v1/users")
      .send({
        ...baseUser,
        email: "addressupdate@example.com"
      });

    const id = create.body.insertedId;

    const res = await request(app)
      .put(`/api/v1/users/${id}`)
      .send({ address: "New Address" });

    expect(res.statusCode).toBe(200);
  });

  it("(40) should allow partial update", async () => {
    const create = await request(app)
      .post("/api/v1/users")
      .send({
        ...baseUser,
        email: "partialupdate@example.com"
      });

    const id = create.body.insertedId;

    const res = await request(app)
      .put(`/api/v1/users/${id}`)
      .send({ fullName: "Partial Updated" });

    expect(res.statusCode).toBe(200);
  });

  // ============================
  // DELETE TESTS
  // ============================

  it("(46) should delete a user", async () => {
    const create = await request(app)
      .post("/api/v1/users")
      .send({
        ...baseUser,
        email: "delete@example.com"
      });

    const id = create.body.insertedId;

    const del = await request(app).delete(`/api/v1/users/${id}`);
    expect(del.statusCode).toBe(200);
    expect(del.body.deletedCount).toBe(1);
  });

  it("(47) should fail invalid delete ID", async () => {
    const del = await request(app).delete("/api/v1/users/123");
    expect(del.statusCode).toBe(400);
  });

  it("(48) should 404 delete non-existent user", async () => {
    const fakeId = new ObjectId().toString();
    const del = await request(app).delete(`/api/v1/users/${fakeId}`);
    expect(del.statusCode).toBe(404);
  });

  it("(49) should fail fetching deleted user", async () => {
    const create = await request(app)
      .post("/api/v1/users")
      .send({
        ...baseUser,
        email: "deletefail@example.com"
      });

    const id = create.body.insertedId;

    await request(app).delete(`/api/v1/users/${id}`);

    const res = await request(app).get(`/api/v1/users/${id}`);
    expect(res.statusCode).toBe(404);
  });

  

});

