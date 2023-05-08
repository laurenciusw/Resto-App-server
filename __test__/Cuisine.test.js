const app = require("../app");
const request = require("supertest");
const { User } = require("../models");
const { sequelize } = require("../models");

const { encodeToken, hashPassword } = require("../helpers/helper.js");

let access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjgzNDkzMzAxfQ.rAcyiLJaqpC1CWkGPiHWzTl0QuTmR_3Vcc1NPqzIBts";
const invalidToken = "gdukyfkuggbl.b";

beforeAll(async () => {
  try {
    let user = require("../data.json").Users;
    user.forEach((e) => {
      e.password = hashPassword(e.password);
      e.createdAt = e.updatedAt = new Date();
    });
    await sequelize.queryInterface.bulkInsert("Users", user, {
      restartIdentity: true,
      cascade: true,
      truncate: true,
    });

    let category = require("../data.json").Categories;
    category.forEach((e) => {
      e.createdAt = e.updatedAt = new Date();
    });
    await sequelize.queryInterface.bulkInsert("Categories", category, {
      restartIdentity: true,
      cascade: true,
      truncate: true,
    });

    const data = require("../data.json").Cuisines;
    data.forEach((e) => {
      e.createdAt = e.updatedAt = new Date();
    });
    await sequelize.queryInterface.bulkInsert("cuisines", data, {
      restartIdentity: true,
      cascade: true,
      truncate: true,
    });
    const bookmark = {
      cuisineId: "1",
      authorId: "1",
    };
    await sequelize.queryInterface.bulkInsert("Bookmarks", bookmark, {
      restartIdentity: true,
      cascade: true,
      truncate: true,
    });
  } catch (error) {
    console.log(error, "ini console log di cuisine ");
  }
});
afterAll(async () => {
  try {
    await sequelize.queryInterface.bulkDelete("Users");
    await sequelize.queryInterface.bulkDelete("Categories");
    await sequelize.queryInterface.bulkDelete("cuisines");
    await sequelize.queryInterface.bulkDelete("Bookmarks");
  } catch (error) {
    console.log(error, "ini console log di cuisine");
  }
});

describe("GET /pub/cuisines", () => {
  it("200 Success get inventories", async () => {
    const response = await request(app).get("/pub/cuisines");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body.totalPage).toEqual(expect.any(Number));
  });
  it("should response with status 200 - (without access_token) with 1 parameter filter query", async () => {
    const response = await request(app).get("/pub/cuisines?fillter=1");
    // console.log(response);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body.totalPage).toEqual(expect.any(Number));
  });
  it("should response with status 200 - without access_token when providing a certain page (check the pagination)", async () => {
    const response = await request(app).get("/pub/cuisines?page=1");
    expect(response.body.totalPage).toEqual(expect.any(Number));
    expect(response.body.data.length).toBeLessThanOrEqual(9);
  });
  it("should response with status 200 - without access_token when providing a certain page (check the pagination)", async () => {
    const response = await request(app).get("/pub/cuisines/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Object));
  });
});

describe("GET /pub/bookmark", () => {
  it("200 Success get bookmark", async () => {
    const response = await request(app)
      .get("/pub/bookmark")
      .set("access_token", access_token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });
  it("201 Success add bookmark", async () => {
    const data = {
      cuisineId: "1",
    };
    const response = await request(app)
      .post("/pub/bookmark/1")
      // .send(data)
      .set("access_token", access_token);
    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toEqual({
      message: "success added to whislist",
    });
  });

  it("400 failed add bookmark", async () => {
    const data = {
      cuisineId: "9999",
    };
    const response = await request(app)
      .post("/pub/bookmark/9999")
      .set("access_token", access_token);
    console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Data not found");
  });
  it("200 failed get bookmark", async () => {
    const response = await request(app).get("/pub/bookmark");

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toEqual({
      message: "invalid token",
    });
  });
  it("200 failde get bookmark", async () => {
    const response = await request(app)
      .get("/pub/bookmark")
      .set("access_token", invalidToken);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toEqual({
      message: "invalid token",
    });
  });
});
