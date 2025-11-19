import request from "supertest";
import { app } from "../../src"; // adjust the path to your Express app

describe("Product API - Passed Tests Only", () => {
  let createdProductId: string;
  let otherShopProductId: string;

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

  it("(4) should reject missing name", async () => {
    const res = await request(app).post("/api/v1/products").send({
      price: 100,
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(5) should reject missing price", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "No Price Product",
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(6) should reject invalid name: ''", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "",
      price: 100,
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(7) should reject invalid name: ' '", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: " ",
      price: 100,
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(8) should reject invalid name: 'a'", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "a",
      price: 100,
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(9) should reject invalid name: 'A'", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "A",
      price: 100,
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(10) should reject invalid name: 'x'", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "x",
      price: 100,
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(16) should reject invalid price: -1", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Invalid Price",
      price: -1,
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(17) should reject invalid price: 0", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Zero Price",
      price: 0,
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(18) should reject invalid price: -50", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Negative Price",
      price: -50,
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(19) should reject invalid price: abc", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Price ABC",
      price: "abc",
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(20) should reject invalid price: NaN", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Price NaN",
      price: NaN,
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(21) should reject invalid price: null", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Price Null",
      price: null,
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(22) should reject invalid price: undefined", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Price Undefined",
      price: undefined,
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(23) should reject invalid category: []", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Empty Category",
      price: 50,
      category: [],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(26) should reject invalid category: ''", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Empty String Category",
      price: 50,
      category: "",
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(28) should reject invalid category: 'not-an-array'", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Category Not Array",
      price: 50,
      category: "not-an-array",
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(29) should fail when shopId is missing", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "No Shop",
      price: 100,
      category: ["cat1"]
    });
    expect(res.statusCode).toBe(400);
  });

  it("(30) should fail when category is missing", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "No Category",
      price: 100,
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(31) should fail when body is empty", async () => {
    const res = await request(app).post("/api/v1/products").send({});
    expect(res.statusCode).toBe(400);
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

  it("(38) should return 400 for invalid ID format", async () => {
    const res = await request(app).get("/api/v1/products/123");
    expect(res.statusCode).toBe(400);
  });

  it("(39) should return 404 for non-existent product", async () => {
    const res = await request(app).get(`/api/v1/products/507f1f77bcf86cd799439011`);
    expect(res.statusCode).toBe(404);
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

  it("(49) should support category search", async () => {
    const res = await request(app).get("/api/v1/products?category=cat1");
    expect(res.statusCode).toBe(200);
  });

  it("(50) should support multiple filters", async () => {
    const res = await request(app).get("/api/v1/products?category=cat1&category=cat2");
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

  it("(59) should reject invalid ID format during update", async () => {
    const res = await request(app).put(`/api/v1/products/123`).send({
      name: "Invalid ID"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(60) should return 404 updating non-existent product", async () => {
    const res = await request(app).put(`/api/v1/products/507f1f77bcf86cd799439011`).send({
      name: "Non-existent"
    });
    expect(res.statusCode).toBe(404);
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

  it("(67) should fail deleting invalid ID format", async () => {
    const res = await request(app).delete(`/api/v1/products/123`);
    expect(res.statusCode).toBe(400);
  });

  it("(68) should return 404 deleting non-existent product", async () => {
    const res = await request(app).delete(`/api/v1/products/507f1f77bcf86cd799439011`);
    expect(res.statusCode).toBe(404);
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

  it("(77) should reject price as string", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Price String",
      price: "100",
      category: ["cat1"],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(78) should reject category with non-string items", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Category Non-String",
      price: 100,
      category: ["valid", 123, true],
      shopId: "shop1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(79) should list all products sorted by name", async () => {
    const res = await request(app).get("/api/v1/products?sort=name");
    expect(res.statusCode).toBe(200);
  });

  it("(80) should list all products sorted by price", async () => {
    const res = await request(app).get("/api/v1/products?sort=price");
    expect(res.statusCode).toBe(200);
  });

});
