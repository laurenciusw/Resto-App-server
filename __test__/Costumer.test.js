const app = require("../app");
const request = require("supertest");
const { User } = require("../models");
const { sequelize } = require("../models");
const { encodeToken, hashPassword } = require("../helpers/helper.js");

beforeAll(async () => {
  try {
    const newUser = {
      username: "customer1",
      email: "customer1@mail.com",
      password: hashPassword("12345"),
      phoneNumber: "08111111111",
      address: "Majalengka",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newUser2 = {
      username: "customer99999",
      email: "customer99999@mail.com",
      password: hashPassword("12345"),
      phoneNumber: "08111111111",
      address: "Majalengka",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await sequelize.queryInterface.bulkInsert("Users", [newUser, newUser2], {});
  } catch (error) {
    console.log(error, "ini console log di customer regist ");
  }
});

afterAll(async () => {
  try {
    await sequelize.queryInterface.bulkDelete("Users", null, {
      restartIdentity: true,
      cascade: true,
      truncate: true,
    });
  } catch (error) {
    console.log(error);
  }
});

describe("POST /pub/register", function () {
  // success register
  describe("Register success", function () {
    it("should create new user as customer", async () => {
      const newUser = {
        username: "customer2",
        email: "customer2@mail.com",
        password: "customerke2",
        phoneNumber: "0822215",
        address: "Ciracas",
      };
      const response = await request(app).post("/pub/register").send(newUser);
      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual({
        message: `customer with email ${newUser.email} succesfully created`,
      });
    });
  });

  describe("Register failed", function () {
    it("email must be required", async () => {
      const newUser = {
        username: "customer3",
        password: "customerke2",
        phoneNumber: "0822215",
        address: "Ciracas",
      };
      const response = await request(app).post("/pub/register").send(newUser);
      // .set("access_token", "ini adalah access token")
      // .set({ access_token: "ini adalah access token" });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual({
        message: `email is required`,
      });
    });

    it("password must be required", async () => {
      const newUser = {
        username: "customer2",
        email: "customer3@mail.com",
        phoneNumber: "0822215",
        address: "Ciracas",
      };
      const response = await request(app).post("/pub/register").send(newUser);
      // .set("access_token", "ini adalah access token")
      // .set({ access_token: "ini adalah access token" });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual({
        message: `password is required`,
      });
    });
    it("email string", async () => {
      const newUser = {
        username: "customer2",
        email: "",
        password: "customerke2",
        phoneNumber: "0822215",
        address: "Ciracas",
      };
      const response = await request(app).post("/pub/register").send(newUser);
      // .set("access_token", "ini adalah access token")
      // .set({ access_token: "ini adalah access token" });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual({
        message: `email is required`,
      });
    });
    it("password string", async () => {
      const newUser = {
        username: "customer2",
        email: "customer3@mail.com",
        password: "",
        phoneNumber: "0822215",
        address: "Ciracas",
      };
      const response = await request(app).post("/pub/register").send(newUser);
      // .set("access_token", "ini adalah access token")
      // .set({ access_token: "ini adalah access token" });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual({
        message: `password is required`,
      });
    });
    it("email must be unique", async () => {
      const newUser = {
        username: "customer2",
        email: "customer1@mail.com",
        password: "12345",
        phoneNumber: "0822215",
        address: "Ciracas",
      };
      const response = await request(app).post("/pub/register").send(newUser);
      // .set("access_token", "ini adalah access token")
      // .set({ access_token: "ini adalah access token" });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual({
        message: `email must be unique`,
      });
    });
    it("invalid format email", async () => {
      const newUser = {
        username: "customer2",
        email: "customer1",
        password: "12345",
        phoneNumber: "0822215",
        address: "Ciracas",
      };
      const response = await request(app).post("/pub/register").send(newUser);
      // .set("access_token", "ini adalah access token")
      // .set({ access_token: "ini adalah access token" });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toEqual({
        message: `Email must be in email format`,
      });
    });
  });
});

describe("POST /pub/login - user login", () => {
  it("200 Success login - should return access_token", async () => {
    const newUser = {
      email: "customer1@mail.com",
      password: "12345",
    };
    const response = await request(app).post("/pub/login").send(newUser);
    console.log(response.body, "!!!!!!");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Object));

    expect(response.body).toHaveProperty("access_token", expect.any(String));
    expect(response.body).toHaveProperty("userEmail", expect.any(String));
  });

  it("401 failed login - should return Email/Password is wrong", async () => {
    const newUser = {
      email: "customer1@mail.com",
      password: "123456",
    };
    const response = await request(app).post("/pub/login").send(newUser);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toEqual({
      message: `Unauthenticated`,
    });
  });

  it("401 Success login - should return Email/Password is wrong", async () => {
    const newUser = {
      email: "customer10@mail.com",
      password: "12345",
    };
    const response = await request(app).post("/pub/login").send(newUser);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toEqual({
      message: `Unauthenticated`,
    });
  });
});
