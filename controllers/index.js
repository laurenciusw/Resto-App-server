const { Cuisine, User, Category } = require("../models/");

class Controller {
  static async getCuisines(req, res) {
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
      res.status(500).json({ message: "internal server error" });
    }
  }

  static async getCuisineById(req, res) {
    try {
      let cuisine = await Cuisine.findByPk(req.params.id);
      if (!cuisine) throw { name: "notFound" };
      res.status(200).json(cuisine);
    } catch (err) {
      if (err.name == "notFound") {
        res.status(404).json({ message: "data not found" });
      } else {
        res.status(500).json({ message: "internal server error" });
      }
    }
  }

  static async createCuisine(req, res) {
    try {
      let { name, description, price, imgUrl, authorId, categoryId } = req.body;
      console.log(req.body);
      let newCuisine = await Cuisine.create({
        name,
        description,
        price,
        imgUrl,
        authorId,
        categoryId,
      });

      res.status(201).json(newCuisine);
    } catch (err) {
      if (err.name == "SequelizeValidationError") {
        res.status(400).json({ message: err.errors.map((el) => el.message) });
      } else {
        res.status(500).json({
          message: "Internal Server Error",
        });
      }
    }
  }

  static async deleteCuisine(req, res) {
    try {
      let id = req.params.id;
      let cuisine = await Cuisine.findByPk(id);

      if (!cuisine) {
        return res.status(404).json({ message: "Cuisine not Found" });
      }
      await Cuisine.destroy({
        where: { id },
      });
      res
        .status(200)
        .json({ message: `Cuisine with id ${id} succes to delete ` });
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
    }
  }

  static async getCategories(req, res) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

module.exports = Controller;
