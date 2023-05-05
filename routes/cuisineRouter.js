const Controller = require("../controllers");
const { authentiaction, authorization } = require("../middlewares/auth");
const cuisineRouter = require("express").Router();

cuisineRouter.get("pub/cuisines", authentiaction, Controller.getCuisines);

cuisineRouter.get("pub/categories", authentiaction, Controller.getCategories);

cuisineRouter.post("pub/categories", authentiaction, Controller.createCategory);

cuisineRouter.post("pub/cuisines", authentiaction, Controller.createCuisine);

cuisineRouter.get("pub/histories", Controller.getHistory);

cuisineRouter.get(
  "pub/cuisines/:id",
  authentiaction,
  authorization,
  Controller.getCuisineById
);

cuisineRouter.put(
  "pub/cuisines/:id",
  authentiaction,
  authorization,
  Controller.changeCuisine
);

cuisineRouter.patch(
  "pub/cuisines/:id",
  authentiaction,
  authorization,
  Controller.changeStatus
);

cuisineRouter.delete(
  "pub/cuisines/:id",
  authentiaction,
  authorization,
  Controller.deleteCuisine
);

// cuisineRouter.delete("/categories/:id", Controller.deleteCategory);

module.exports = cuisineRouter;
