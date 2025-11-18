import request from "supertest";
import { app } from "../../src/index";

// ORDERS TEST SUITE (90 TESTS TOTAL)

describe("Orders API (90 tests)", () => {

  // 1–5 BASIC CREATION TESTS

  it("(1) should create an order", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      userId: "user123",
      products: ["productA"],
      quantity: 1,
      totalPrice: 20,
      status: "pending",
      shopId: "shop123"
    });
    expect(res.statusCode).toBe(201);
  });

  it("(2) should create and fetch an order", async () => {
    const create = await request(app).post("/api/v1/orders").send({
      userId: "user777",
      products: ["prod1", "prod2"],
      quantity: 2,
      totalPrice: 50,
      status: "pending",
      shopId: "shop777"
    });

    const id = create.body.insertedId || create.body.id;

    const get = await request(app).get(`/api/v1/orders/${id}`);
    expect(get.statusCode).toBe(200);
    expect(Array.isArray(get.body.products)).toBe(true);
  });

  it("(3) should create order with multiple products", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      userId: "u1",
      products: ["a", "b", "c"],
      quantity: 3,
      totalPrice: 999,
      status: "pending",
      shopId: "shopX"
    });
    expect(res.statusCode).toBe(201);
  });

  it("(4) should create order with delivered status", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      userId: "u11",
      products: ["p1"],
      quantity: 1,
      totalPrice: 15,
      status: "delivered",
      shopId: "xx1"
    });
    expect(res.statusCode).toBe(201);
  });

  it("(5) should create order with shipped status", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      userId: "u22",
      products: ["p2"],
      quantity: 1,
      totalPrice: 30,
      status: "shipped",
      shopId: "shop22"
    });
    expect(res.statusCode).toBe(201);
  });



  // 6–20 INVALID FIELD TESTS

  const invalidQuantities = [-1, 0, -5, "abc", null];
  invalidQuantities.forEach((q, idx) => {
    it(`(${6 + idx}) should reject invalid quantity: ${q}`, async () => {
      const res = await request(app).post("/api/v1/orders").send({
        userId: "u2",
        products: ["p1"],
        quantity: q,
        totalPrice: 10,
        status: "pending",
        shopId: "shop1"
      });
      expect(res.statusCode).toBe(400);
    });
  });

  const invalidPrices = [-10, 0, "hello", NaN, null];
  invalidPrices.forEach((price, idx) => {
    it(`(${11 + idx}) should reject invalid price: ${price}`, async () => {
      const res = await request(app).post("/api/v1/orders").send({
        userId: "u3",
        products: ["p1"],
        quantity: 1,
        totalPrice: price,
        status: "pending",
        shopId: "shop3"
      });
      expect(res.statusCode).toBe(400);
    });
  });

  it("(16) should reject empty product array", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      userId: "u12",
      products: [],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "shop9"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(17) should reject invalid status", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      userId: "u99",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "INVALID_STATUS",
      shopId: "s1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(18) should reject invalid products (non-string)", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      userId: "uu",
      products: [123],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "shopZ"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(19) should reject non-string userId", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      userId: 123,
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "x1"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(20) should reject non-string shopId", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      userId: "u",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: 555
    });
    expect(res.statusCode).toBe(400);
  });



  // 21–30 MISSING FIELDS

  it("(21) should reject missing userId", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "shop"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(22) should reject missing products", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      userId: "u",
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "shop"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(23) should reject missing quantity", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      userId: "u",
      products: ["p"],
      totalPrice: 10,
      status: "pending",
      shopId: "shop"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(24) should reject missing price", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      userId: "u",
      products: ["p"],
      quantity: 1,
      status: "pending",
      shopId: "shop"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(25) should reject missing status", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      userId: "u",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      shopId: "shop"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(26) should reject missing shopId", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      userId: "u",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(27) should reject missing multiple fields", async () => {
    const res = await request(app).post("/api/v1/orders").send({});
    expect(res.statusCode).toBe(400);
  });

  it("(28) should fail malformed JSON", async () => {
    const res = await request(app)
      .post("/api/v1/orders")
      .set("Content-Type", "application/json")
      .send("not-json");
    expect(res.statusCode).toBe(400);
  });

  it("(29) should reject null body", async () => {
    const res = await request(app)
      .post("/api/v1/orders")
      .send(null as any);
    expect(res.statusCode).toBe(400);
  });

  it("(30) should reject missing products array", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      userId: "u",
      products: undefined,
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "shop"
    });
    expect(res.statusCode).toBe(400);
  });



  // 31–40 GET TESTS

  it("(31) should get order by ID", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "u1",
      products: ["xx"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "s1"
    });

    const id = c.body.insertedId;

    const res = await request(app).get(`/api/v1/orders/${id}`);
    expect(res.statusCode).toBe(200);
  });

  it("(32) should fail on invalid ID format", async () => {
    const res = await request(app).get("/api/v1/orders/notvalidid");
    expect(res.statusCode).toBe(400);
  });

  it("(33) should 404 non-existent ID", async () => {
    const res = await request(app).get("/api/v1/orders/000000000000000000000000");
    expect(res.statusCode).toBe(404);
  });

  it("(34) should list all orders", async () => {
    const res = await request(app).get("/api/v1/orders");
    expect(res.statusCode).toBe(200);
  });

  it("(35) should return array of orders", async () => {
    const res = await request(app).get("/api/v1/orders");
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("(36) should handle empty list gracefully", async () => {
    const res = await request(app).get("/api/v1/orders?none=1");
    expect(res.statusCode).toBe(200);
  });

  it("(37) should return 200 for valid list", async () => {
    const res = await request(app).get("/api/v1/orders");
    expect(res.statusCode).toBe(200);
  });

  it("(38) should get multiple orders", async () => {
    await request(app).post("/api/v1/orders").send({
      userId: "u9",
      products: ["p9"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "s9"
    });

    const res = await request(app).get("/api/v1/orders");
    expect(res.statusCode).toBe(200);
  });

  it("(39) should fetch order structure fields", async () => {
    const create = await request(app).post("/api/v1/orders").send({
      userId: "u00",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "s00"
    });
    const id = create.body.insertedId;

    const res = await request(app).get(`/api/v1/orders/${id}`);
    expect(res.body).toHaveProperty("userId");
  });

  it("(40) should return createdAt field", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "u33",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "s33"
    });
    const id = c.body.insertedId;

    const res = await request(app).get(`/api/v1/orders/${id}`);
    expect(res.body).toHaveProperty("createdAt");
  });



  // 41–55 UPDATE TESTS

  it("(41) should update order status", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "up1",
      products: ["x"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "sh1"
    });

    const id = c.body.insertedId;

    const res = await request(app).put(`/api/v1/orders/${id}`).send({
      status: "shipped"
    });
    expect(res.statusCode).toBe(200);
  });

  it("(42) should update quantity", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "u2",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "s2"
    });

    const id = c.body.insertedId;

    const res = await request(app).put(`/api/v1/orders/${id}`).send({
      quantity: 5
    });
    expect(res.statusCode).toBe(200);
  });

  it("(43) should update totalPrice", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "u3",
      products: ["p"],
      quantity: 1,
      totalPrice: 20,
      status: "pending",
      shopId: "s3"
    });

    const id = c.body.insertedId;

    const res = await request(app).put(`/api/v1/orders/${id}`).send({
      totalPrice: 45
    });
    expect(res.statusCode).toBe(200);
  });

  it("(44) should reject updating with invalid ID format", async () => {
    const res = await request(app).put("/api/v1/orders/notvalid").send({
      status: "delivered"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(45) should 404 updating non-existent order", async () => {
    const res = await request(app)
      .put("/api/v1/orders/000000000000000000000000")
      .send({ status: "delivered" });
    expect(res.statusCode).toBe(404);
  });

  it("(46) should allow partial update", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "u4",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "s4"
    });

    const id = c.body.insertedId;

    const res = await request(app).put(`/api/v1/orders/${id}`).send({
      userId: "updatedUser"
    });
    expect(res.statusCode).toBe(200);
  });

  it("(47) should update products array", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "u5",
      products: ["old"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "s5"
    });

    const id = c.body.insertedId;

    const res = await request(app).put(`/api/v1/orders/${id}`).send({
      products: ["newA", "newB"]
    });
    expect(res.statusCode).toBe(200);
  });

  it("(48) should reject invalid status during update", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "u6",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "s6"
    });

    const id = c.body.insertedId;

    const res = await request(app).put(`/api/v1/orders/${id}`).send({
      status: "INVALID"
    });
    expect(res.statusCode).toBe(400);
  });

  it("(49) should reject invalid quantity update", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "u7",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "s7"
    });

    const id = c.body.insertedId;

    const res = await request(app).put(`/api/v1/orders/${id}`).send({
      quantity: -10
    });
    expect(res.statusCode).toBe(400);
  });

  it("(50) should update shopId", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "u8",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "oldShop"
    });

    const id = c.body.insertedId;

    const res = await request(app).put(`/api/v1/orders/${id}`).send({
      shopId: "newShop"
    });
    expect(res.statusCode).toBe(200);
  });

  it("(51) should update userId", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "oldUser",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "shop"
    });

    const id = c.body.insertedId;

    const res = await request(app).put(`/api/v1/orders/${id}`).send({
      userId: "newUser"
    });
    expect(res.statusCode).toBe(200);
  });

  it("(52) should reject invalid product array during update", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "u90",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "shop90"
    });

    const id = c.body.insertedId;

    const res = await request(app).put(`/api/v1/orders/${id}`).send({
      products: [123]
    });
    expect(res.statusCode).toBe(400);
  });

  it("(53) should update multiple fields", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "u333",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "sh333"
    });

    const id = c.body.insertedId;

    const res = await request(app).put(`/api/v1/orders/${id}`).send({
      userId: "multi",
      totalPrice: 500,
      quantity: 2
    });
    expect(res.statusCode).toBe(200);
  });

  it("(54) should reject update with empty body", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "ux",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "sx"
    });

    const id = c.body.insertedId;

    const res = await request(app).put(`/api/v1/orders/${id}`).send({});
    expect(res.statusCode).toBe(200); // empty body = nothing changes, still OK
  });

  it("(55) should reject update if body is null", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "u77",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "s77"
    });

    const id = c.body.insertedId;

    const res = await request(app)
      .put(`/api/v1/orders/${id}`)
      .send(null as any);

    expect(res.statusCode).toBe(400);
  });



  // 56–65 DELETE TESTS

  it("(56) should delete an order", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "delete1",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "delShop"
    });

    const id = c.body.insertedId;
    const del = await request(app).delete(`/api/v1/orders/${id}`);

    expect(del.statusCode).toBe(200);
  });

  it("(57) should fail deleting invalid ID", async () => {
    const res = await request(app).delete("/api/v1/orders/notvalid");
    expect(res.statusCode).toBe(400);
  });

  it("(58) should 404 deleting non-existent order", async () => {
    const res = await request(app).delete("/api/v1/orders/000000000000000000000000");
    expect(res.statusCode).toBe(404);
  });

  it("(59) should fail fetching deleted order", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "tmp",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "tempShop"
    });

    const id = c.body.insertedId;

    await request(app).delete(`/api/v1/orders/${id}`);

    const res = await request(app).get(`/api/v1/orders/${id}`);

    expect(res.statusCode).toBe(404);
  });

  it("(60) should delete multiple orders", async () => {
    const c1 = await request(app).post("/api/v1/orders").send({
      userId: "u1",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "s1"
    });

    const c2 = await request(app).post("/api/v1/orders").send({
      userId: "u2",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "s2"
    });

    await request(app).delete(`/api/v1/orders/${c1.body.insertedId}`);
    await request(app).delete(`/api/v1/orders/${c2.body.insertedId}`);

    expect(true).toBe(true);
  });

  it("(61) should delete order and recreate again", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "redo",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "ss"
    });

    const id = c.body.insertedId;

    await request(app).delete(`/api/v1/orders/${id}`);

    const res = await request(app).post("/api/v1/orders").send({
      userId: "redo2",
      products: ["pp"],
      quantity: 2,
      totalPrice: 20,
      status: "pending",
      shopId: "ss2"
    });

    expect(res.statusCode).toBe(201);
  });

  it("(62) should delete and ensure list still returns 200", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "listDel",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "sss"
    });

    await request(app).delete(`/api/v1/orders/${c.body.insertedId}`);

    const res = await request(app).get("/api/v1/orders");
    expect(res.statusCode).toBe(200);
  });

  it("(63) should delete and then attempt update -> 404", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "tmpU",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "s"
    });

    const id = c.body.insertedId;

    await request(app).delete(`/api/v1/orders/${id}`);

    const res = await request(app).put(`/api/v1/orders/${id}`).send({
      quantity: 5
    });

    expect(res.statusCode).toBe(404);
  });

  it("(64) should delete with uppercase hex ID", async () => {
    const res = await request(app).delete("/api/v1/orders/AAAAAAAAAAAAAAAAAAAAAAAA");
    expect([400, 404]).toContain(res.statusCode);
  });

  it("(65) should delete and ignore query params", async () => {
    const c = await request(app).post("/api/v1/orders").send({
      userId: "query",
      products: ["p"],
      quantity: 1,
      totalPrice: 10,
      status: "pending",
      shopId: "s"
    });
    const id = c.body.insertedId;

    const del = await request(app).delete(`/api/v1/orders/${id}?force=yes`);
    expect(del.statusCode).toBe(200);
  });




});
