const Controller = require("../controllers");
const { authentiaction, authorization } = require("../middlewares/auth");
const cuisineRouter = require("express").Router();

cuisineRouter.get("/cuisines", authentiaction, Controller.getCuisines);

cuisineRouter.get("/categories", authentiaction, Controller.getCategories);

cuisineRouter.post("/cuisines/", authentiaction, Controller.createCuisine);

cuisineRouter.get("/cuisines/:id", authentiaction, Controller.getCuisineById);

cuisineRouter.delete(
  "/cuisines/:id",
  authentiaction,
  authorization,
  Controller.deleteCuisine
);

module.exports = cuisineRouter;
