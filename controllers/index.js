const { comparePassword, encodeToken } = require("../helpers/helper");
const { Cuisine, User, Category } = require("../models/");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class Controller {
  static async getCuisines(req, res, next) {
    try {
      const cuisines = await Cuisine.findAll({
        include: {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
      });
      res.status(200).json(cuisines);
    } catch (error) {
      next(error);
    }
  }

  static async getCuisineById(req, res, next) {
    try {
      let cuisine = await Cuisine.findByPk(req.params.id);
      if (!cuisine) throw { name: "NotFound" };
      res.status(200).json(cuisine);
    } catch (error) {
      next(error);
    }
  }

  static async createCuisine(req, res, next) {
    try {
      let { name, description, price, imgUrl, categoryId } = req.body;

      if (!categoryId) throw { name: "categoryRequired" };

      let newCuisine = await Cuisine.create({
        name,
        description,
        price,
        imgUrl,
        authorId: req.user.id,
        categoryId,
      });

      res.status(201).json(newCuisine);
    } catch (error) {
      next(error);
    }
  }

  static async deleteCuisine(req, res, next) {
    try {
      let id = req.params.id;
      let cuisine = await Cuisine.findByPk(id);

      if (!cuisine) throw { name: "NotFound" };
      await Cuisine.destroy({
        where: { id },
      });
      res
        .status(200)
        .json({ message: `Cuisine with id ${id} succes to delete` });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req, res, next) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;

      if (!email) throw { name: "EmailRequired" };

      if (!password) throw { name: "PasswordRequired" };

      const user = await User.create({
        username,
        email,
        password,
        phoneNumber,
        address,
      });
      res.status(201).json({
        message: `user with email ${email} succesfully created`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, email, password, role, phoneNumber, address } =
        req.body;

      if (!email) throw { name: "EmailRequired" };

      if (!password) throw { name: "PasswordRequired" };

      const user = await User.findOne({ where: { email } });

      if (!user) throw { name: "InvalidCredentials" };

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) throw { name: "InvalidCredentials" };

      let payload = {
        id: user.id,
      };

      let acces_token = encodeToken(payload);
      let userRole = user.role;

      res.status(200).json({
        acces_token,
        email,
        userRole,
      });
    } catch (error) {
      next(error);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      let google_token = req.headers.google_token;

      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      let user = await User.findOne({
        where: { email: payload.email },
      });
      if (!user) {
        user = await User.create({
          username: payload.name,
          email: payload.email,
          password: Math.random() + "ABCD",
          role: "staff",
        });
      }
      let payload_access_token = {
        id: user.id,
      };
      let acces_token = encodeToken(payload_access_token);
      let userRole = user.role;
      let userEmail = user.email;
      res.status(200).json({
        acces_token,
        userRole,
        userEmail,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req, res, next) {
    try {
      let { name } = req.body;

      let newCategory = await Category.create({
        name,
      });

      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      let id = req.params.id;
      let category = await Category.findByPk(id);

      if (!category) throw { name: "NotFound" };
      await Category.destroy({
        where: { id },
      });
      res
        .status(200)
        .json({ message: `Category with id ${id} succes to delete` });
    } catch (error) {
      next(error);
    }
  }

  static async changeCuisine(req, res, next) {
    try {
      let id = req.params.id;
      let newData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        imgUrl: req.body.imgUrl,
        categoryId: req.body.categoryId,
      };
      let cuisine = await Cuisine.findByPk(id);
      if (!cuisine) throw { name: "NotFound" };

      await Cuisine.update(newData, { where: { id } });
      res
        .status(200)
        .json({ message: `cuisine with id ${id} has been updated` });
    } catch (error) {
      next(error);
    }
  }

  static async changeStatus(req, res, next) {
    try {
      let id = req.params.id;
      let newStatus = {
        status: req.body.status,
      };
      let cuisine = await Cuisine.findByPk(id);
      if (!cuisine) throw { name: "NotFound" };

      await Cuisine.update(newStatus, { where: { id } });
      res.status(200).json({
        message: `cuisine status with id ${id} has benn changed to ${newStatus}`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
