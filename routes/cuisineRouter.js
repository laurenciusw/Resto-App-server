const Controller = require("../controllers");
const { authentiaction, authorization } = require("../middlewares/auth");
const cuisineRouter = require("express").Router();

cuisineRouter.get("/cuisines", authentiaction, Controller.getCuisines);

cuisineRouter.get("/categories", authentiaction, Controller.getCategories);

cuisineRouter.post("/categories", authentiaction, Controller.createCategory);

cuisineRouter.post("/cuisines/", authentiaction, Controller.createCuisine);

cuisineRouter.get("/histories", Controller.getHistory);

cuisineRouter.get(
  "/cuisines/:id",
  authentiaction,
  authorization,
  Controller.getCuisineById
);

cuisineRouter.put(
  "/cuisines/:id",
  authentiaction,
  authorization,
  Controller.changeCuisine
);

cuisineRouter.patch(
  "/cuisines/:id",
  authentiaction,
  authorization,
  Controller.changeStatus
);

cuisineRouter.delete(
  "/cuisines/:id",
  authentiaction,
  authorization,
  Controller.deleteCuisine
);

// cuisineRouter.delete("/categories/:id", Controller.deleteCategory);

module.exports = cuisineRouter;
