const { comparePassword, encodeToken } = require("../helpers/helper");
const { Cuisine, User, Category } = require("../models/");

class Controller {
  static async getCuisines(req, res, next) {
    console.log(req.user);
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
      console.log(req.body);
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
    console.log(req.user);
    try {
      let id = req.params.id;
      let cuisine = await Cuisine.findByPk(id);

      if (!cuisine) throw { name: "NotFound" };
      // await Cuisine.destroy({
      //   where: { id },
      // });
      res
        .status(200)
        .json({ message: `Cuisine with id ${id} succes to delete ` });
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
      const { username, email, password, role, phoneNumber, address } =
        req.body;

      if (!email) throw { name: "EmailOrPasswordRequired" };

      if (!password) throw { name: "EmailOrPasswordRequired" };

      const user = await User.create({
        username,
        email,
        password,
        role,
        phoneNumber,
        address,
      });
      res.status(201).json({
        message: `user with email ${email} succesfully created`,
      });
    } catch (error) {
      // res.send(error);
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, email, password, role, phoneNumber, address } =
        req.body;

      if (!email) throw { name: "EmailOrPasswordRequired" };

      if (!password) throw { name: "EmailOrPasswordRequired" };

      const user = await User.findOne({ where: { email } });

      if (!user) throw { name: "InvalidCredentials" };

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) throw { name: "InvalidCredentials" };

      let payload = {
        id: user.id,
      };

      let acces_token = encodeToken(payload);
      res.status(200).json({
        acces_token,
      });

      // const acces_token = encodeToken({ id: user.id });
      // res.status(200).json({
      //   acces_token: token,
      // });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
