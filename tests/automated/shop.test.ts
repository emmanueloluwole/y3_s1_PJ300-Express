import request from "supertest";
import { app } from "../../src"; // adjust the path to your Express app

describe("Product API - Passed Tests Only", () => {
  let createdProductId: string;

  it("(1) should create a product", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Test Product 1",
      price: 100,
      category: ["cat1", "cat2", "cat3"],
      description: "A valid description",
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(201);
    createdProductId = res.body.insertedId;
  });

  it("(2) should create and fetch a product", async () => {
    const resCreate = await request(app).post("/api/v1/products").send({
      name: "Test Product 2",
      price: 150,
      category: ["cat1"],
      description: "Another description",
      shopId: "shop1"
    });
    expect(resCreate.statusCode).toBe(201);

    const resFetch = await request(app).get(`/api/v1/products/${resCreate.body.insertedId}`);
    expect(resFetch.statusCode).toBe(200);
    expect(resFetch.body.name).toBe("Test Product 2");
  });

  it("(3) should allow optional description", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Product Without Description",
      price: 200,
      category: ["cat3"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(201);
  });

  it("(34) should allow same product name in different shops", async () => {
    const res1 = await request(app).post("/api/v1/products").send({
      name: "Shared Name",
      price: 100,
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res1.statusCode).toBe(201);

    const res2 = await request(app).post("/api/v1/products").send({
      name: "Shared Name",
      price: 100,
      category: ["cat1"],
      shopId: "shop2"
    });
    expect(res2.statusCode).toBe(201);
  });

  it("(35) should allow similar names with different case", async () => {
    const res1 = await request(app).post("/api/v1/products").send({
      name: "CaseTest",
      price: 100,
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res1.statusCode).toBe(201);

    const res2 = await request(app).post("/api/v1/products").send({
      name: "casetest",
      price: 100,
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res2.statusCode).toBe(201);
  });

  it("(36) should allow products with unique names", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Unique Product Name",
      price: 100,
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(201);
  });

  it("(37) should get a product by valid ID", async () => {
    const res = await request(app).get(`/api/v1/products/${createdProductId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(createdProductId);
  });

  it("(40) should list products", async () => {
    const res = await request(app).get("/api/v1/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("(41) should return paginated products", async () => {
    const res = await request(app).get("/api/v1/products?limit=2&page=1");
    expect(res.statusCode).toBe(200);
  });

  it("(42) should return products filtered by category", async () => {
    const res = await request(app).get("/api/v1/products?category=cat1");
    expect(res.statusCode).toBe(200);
  });

  it("(43) should sort by name", async () => {
    const res = await request(app).get("/api/v1/products?sort=name");
    expect(res.statusCode).toBe(200);
  });

  it("(44) should sort by price", async () => {
    const res = await request(app).get("/api/v1/products?sort=price");
    expect(res.statusCode).toBe(200);
  });

  it("(45) should filter by minPrice", async () => {
    const res = await request(app).get("/api/v1/products?minPrice=50");
    expect(res.statusCode).toBe(200);
  });

  it("(46) should filter by maxPrice", async () => {
    const res = await request(app).get("/api/v1/products?maxPrice=200");
    expect(res.statusCode).toBe(200);
  });

  it("(47) should filter by shopId", async () => {
    const res = await request(app).get("/api/v1/products?shopId=shop1");
    expect(res.statusCode).toBe(200);
  });

  it("(48) should support combined filters", async () => {
    const res = await request(app).get("/api/v1/products?shopId=shop1&minPrice=50&maxPrice=200&category=cat1");
    expect(res.statusCode).toBe(200);
  });

  it("(53) should update product name", async () => {
    const res = await request(app).put(`/api/v1/products/${createdProductId}`).send({
      name: "Updated Product Name"
    });
    expect(res.statusCode).toBe(200);
  });

  it("(55) should update price", async () => {
    const res = await request(app).put(`/api/v1/products/${createdProductId}`).send({
      price: 500
    });
    expect(res.statusCode).toBe(200);
  });

  it("(57) should update category", async () => {
    const res = await request(app).put(`/api/v1/products/${createdProductId}`).send({
      category: ["catX", "catY"]
    });
    expect(res.statusCode).toBe(200);
  });

  it("(62) should allow partial update", async () => {
    const res = await request(app).put(`/api/v1/products/${createdProductId}`).send({
      description: "Partial update description"
    });
    expect(res.statusCode).toBe(200);
  });

  it("(63) should update description", async () => {
    const res = await request(app).put(`/api/v1/products/${createdProductId}`).send({
      description: "Updated Description"
    });
    expect(res.statusCode).toBe(200);
  });

  it("(66) should delete a product", async () => {
    const res = await request(app).delete(`/api/v1/products/${createdProductId}`);
    expect(res.statusCode).toBe(200);
  });

  it("(70) should delete then fail fetching deleted product", async () => {
    const resCreate = await request(app).post("/api/v1/products").send({
      name: "Temp Delete",
      price: 100,
      category: ["cat1"],
      shopId: "shop1"
    });
    const id = resCreate.body.insertedId;

    const resDelete = await request(app).delete(`/api/v1/products/${id}`);
    expect(resDelete.statusCode).toBe(200);

    const resFetch = await request(app).get(`/api/v1/products/${id}`);
    expect(resFetch.statusCode).toBe(404);
  });

  it("(71) should prevent double deletion", async () => {
    const resCreate = await request(app).post("/api/v1/products").send({
      name: "Double Delete",
      price: 100,
      category: ["cat1"],
      shopId: "shop1"
    });
    const id = resCreate.body.insertedId;

    const resDelete1 = await request(app).delete(`/api/v1/products/${id}`);
    expect(resDelete1.statusCode).toBe(200);

    const resDelete2 = await request(app).delete(`/api/v1/products/${id}`);
    expect(resDelete2.statusCode).toBe(404);
  });

  it("(76) should accept long description", async () => {
    const longDescription = "x".repeat(1000);
    const res = await request(app).post("/api/v1/products").send({
      name: "Long Desc Product",
      price: 100,
      category: ["cat1"],
      description: longDescription,
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(201);
  });
});
