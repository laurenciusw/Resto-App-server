const Controller = require("../controllers");
const userRouter = require("express").Router();

userRouter.post("/users/register", Controller.register);

userRouter.post("/auth/login", Controller.login);

module.exports = userRouter;
