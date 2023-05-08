const Controller = require("../controllers");
const { authentiaction, authorization } = require("../middlewares/auth");
const publicRouter = require("express").Router();

publicRouter.post("/pub/register", Controller.customerRegister);

publicRouter.post("/pub/login", Controller.customerLogin);

publicRouter.get("/pub/cuisines", Controller.allCuisines);

publicRouter.get("/pub/cuisines/:id", Controller.detailCuisine);

publicRouter.get("/pub/bookmark", authentiaction, Controller.getBookmark);

publicRouter.post(
  "/pub/bookmark/:id",
  authentiaction,
  Controller.createBookmark
);

publicRouter.post("/pub/login-google", Controller.customerGoogleLogin);

module.exports = publicRouter;
