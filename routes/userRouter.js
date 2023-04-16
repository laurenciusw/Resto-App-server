const Controller = require("../controllers");
const userRouter = require("express").Router();

userRouter.post("/users/register", Controller.register);

userRouter.post("/auth/login", Controller.login);

userRouter.post("/auth/login-google", Controller.googleLogin);

module.exports = userRouter;
