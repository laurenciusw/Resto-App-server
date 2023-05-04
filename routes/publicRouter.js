const Controller = require("../controllers");
const publicRouter = require("express").Router();

publicRouter.post("/pub/register", Controller.customerRegister);

publicRouter.post("/pub/login", Controller.customerRegister);

// publicRouter.post("/pub/login-google", Controller.googleLogin);

module.exports = publicRouter;
