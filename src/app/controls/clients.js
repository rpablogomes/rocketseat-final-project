const client = require("../models/client");

exports.index = function (req, res) {
  let { filter, page, limit } = req.query;

  filter = "";
  page = 1;
  limit = 6;
  let offset = limit * (page - 1) || 0;

  const params = {
    filter,
    limit,
    offset,
    callback(recipes) {
      console.log(recipes)
      res.render("../views/client/index", { recipes });
    },
  };

  client.recipes(params);
};
exports.about = function (req, res) {
  return res.render("client/about");
};
exports.recipes = function (req, res) {
  let { filter, page, limit } = req.query;

  filter = filter || "";
  page = page || 1;
  limit = limit || 2;
  let offset = limit * (page - 1) || 0;

  const params = {
    filter,
    limit,
    offset,
    callback(recipes) {
      console.log(pagination)
      return res.render("client/recipes", { recipes, pagination });
    },
    notFound() {
      res.render("client/not-found");
    },
  };

  client.recipes(params);
};
exports.recipe = function (req, res) {
  const id = req.params.id;

  client.recipe(id, (callback) => {
    return res.render("../views/client/recipe", { recipe: callback });
  });
};
exports.chefs = function (req, res) {
  client.chefs((callback) => {
    return res.render("client/chefs", { chefs: callback });
  });
};
