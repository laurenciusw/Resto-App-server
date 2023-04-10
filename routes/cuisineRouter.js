const Controller = require("../controllers");
const cuisineRouter = require("express").Router();

cuisineRouter.get("/cuisines", Controller.getCuisines);

cuisineRouter.get("/categories", Controller.getCategories);

cuisineRouter.post("/cuisines/", Controller.createCuisine);

cuisineRouter.get("/cuisines/:id", Controller.getCuisineById);

cuisineRouter.delete("/cuisines/:id", Controller.deleteCuisine);

module.exports = cuisineRouter;
