const { decodeToken } = require("../helpers/helper");

const { User, Cuisine } = require("../models");

async function authentiaction(req, res, next) {
  let acces_token = req.headers.acces_token;
  try {
    if (!acces_token) {
      throw { name: "invalidToken" };
    }

    let payload = decodeToken(acces_token);
    let user = await User.findByPk(payload.id);
    if (!user) {
      throw { name: "invalidToken" };
    }
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    next(error);
  }
}

async function authorization(req, res, next) {
  try {
    let userId = req.user.id;
    let role = req.user.role;
    let cuisine = await Cuisine.findByPk(req.params.id);

    if (!cuisine) {
      throw { name: "NotFound" };
    }
    if (role == "staff") {
      if (userId !== cuisine.authorId) {
        throw { name: "Forbidden" };
      }
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authentiaction,
  authorization,
};
