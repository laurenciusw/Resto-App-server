const { comparePassword, encodeToken } = require("../helpers/helper");
const { Cuisine, User, Category, History, Bookmark } = require("../models/");
const { Op } = require("sequelize");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");

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

      let user = await User.findByPk(newCuisine.authorId);

      let newHistory = await History.create({
        name: newCuisine.name,
        description: `new Cuisine with id  ${newCuisine.id} has been created`,
        updatedBy: user.email,
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
      let userEmail = user.email;

      res.status(200).json({
        acces_token,
        userEmail,
        userRole,
      });
    } catch (error) {
      next(error);
    }
  }

  static async googleLogin(req, res, next) {
    console.log(req.headers.google_token, "<<<<<<");
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
      console.log(req.user);
      let newHistory = await History.create({
        name: cuisine.name,
        description: `Cuisine with id ${id} has been updated`,
        updatedBy: req.user.email,
      });

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

      let newHistory = await History.create({
        name: cuisine.name,
        description: `Cuisine status with id ${id} has been updated from ${cuisine.status} to ${req.body.status}`,
        updatedBy: req.user.email,
      });

      await Cuisine.update(newStatus, { where: { id } });

      res.status(200).json({
        message: `cuisine status with id ${id} has benn changed to ${newStatus}`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req, res, next) {
    try {
      const history = await History.findAll({
        order: [["updatedAt", "desc"]],
      });

      res.status(200).json(history);
    } catch (error) {
      next(error);
    }
  }

  //customer side
  static async customerRegister(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;

      if (!email) throw { name: "EmailRequired" };

      if (!password) throw { name: "PasswordRequired" };

      const user = await User.create({
        username,
        email,
        password,
        role: "Customer",
        phoneNumber,
        address,
      });
      res.status(201).json({
        message: `customer with email ${email} succesfully created`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async customerLogin(req, res, next) {
    try {
      console.log("masuk");
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

      let access_token = encodeToken(payload);
      let userRole = user.role;
      let userEmail = user.email;

      res.status(200).json({
        access_token,
        userEmail,
      });
    } catch (error) {
      next(error);
    }
  }

  static async customerGoogleLogin(req, res, next) {
    console.log(req.headers.google_token, "<<<<<<");
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
          role: "Customer",
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

  static async allCuisines(req, res, next) {
    const { page, filter, categorySearch } = req.query;
    const { id } = req.params;

    let query = {
      limit: 9,
      where: { status: "Active" },
      order: [["id", "ASC"]],
    };

    if (page) {
      query.offset = (page - 1) * query.limit;
    }

    if (categorySearch) {
      query.where.categoryId = categorySearch;
    }

    if (filter) {
      query.where = {
        ...query.where,
        name: {
          [Op.iLike]: `%${filter}%`,
        },
      };
    }

    if (id) {
      req.query = null;
      query = { where: { id } };
    }

    try {
      let { count, rows } = await Cuisine.findAndCountAll(query);
      const result = {
        totalPage: Math.ceil(count / query.limit),
        currentPage: page,
        data: rows,
      };
      res.status(200).json(result);
    } catch (error) {
      console.log(error, "<<<<<<<");
      next(error);
    }
  }

  static async detailCuisine(req, res, next) {
    try {
      let cuisine = await Cuisine.findByPk(req.params.id);
      if (!cuisine) throw { name: "NotFound" };

      const baseurl =
        "https://api.qr-code-generator.com/v1/create?access-token=w9Of7YgHEMPY8TUeqi_c9JUu5lVe6mDGwAzG5rCFcA5F9w-mXmZ1fLLzVS2Cxs11";

      const { data } = await axios({
        url: baseurl,
        method: "post",
        data: {
          frame_name: "no-frame",
          qr_code_text: `https://william-rmt35.web.app/cuisines/${req.params.id}`,
          image_format: "SVG",
          qr_code_logo: "scan-me-square",
        },
      });

      cuisine.dataValues.qr = data;
      res.status(200).json(cuisine);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // bookmark

  static async createBookmark(req, res, next) {
    try {
      let cuisine = await Cuisine.findByPk(req.params.id);
      if (!cuisine) throw { name: "NotFound" };
      console.log(req.user);

      let newBookmark = await Bookmark.create({
        userId: req.user.id,
        cuisineId: cuisine.id,
      });

      // let user = await User.findByPk(newCuisine.authorId);

      // let newHistory = await History.create({
      //   name: newCuisine.name,
      //   description: `new Cuisine with id  ${newCuisine.id} has been created`,
      //   updatedBy: user.email,
      // });

      res.status(201).json(newBookmark);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  static async getBookmark(req, res, next) {
    try {
      let userId = req.user.id;

      const data = await Bookmark.findAll({
        where: { userId },
        include: {
          model: Cuisine,
        },
      });
      // console.log(data);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
