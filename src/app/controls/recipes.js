const { recipes } = require("../models/client");
const recipe = require("../models/recipe");
const getSince = require("../lib/utils").getSince;
const File = require("../models/file");

module.exports = {
  async index(req, res) {
    recipe.index((callback) => {
      const recipes = callback.reduce((acc, current) => {
        const x = acc.find((item) => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      res.render("admin/recipes/recipes", { recipes });
    });
  } /* ok */,

  async create(req, res) {
    recipe.chefsList((chefsList) => {
      return res.render("admin/recipes/create", { chefsList });
    });
  } /* ok */,

  async post(req, res) {
    const keys = Object.keys(req.body);

    //validation
    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Fill all the fields");
      }
    }

    // Construct Object to Push into data
    let { chef_id, title, ingredients, preparation, information } = req.body;

    const values = [
      chef_id,
      title,
      ingredients,
      preparation,
      information,
      getSince(),
    ];

    const files = req.files;

    recipe.create(values, files, (callback) => {
      return res.redirect(`recipes/${callback}`);
    });
  } /* ok */,

  async show(req, res) {
    const id = req.params.id;
    recipe.find(id, (callback) => {
      recipe.files(callback.id, (files) => {
        const recipe = { ...callback, files };
        res.render("admin/recipes/recipe", { recipe });
      });
    });
  } /* ok */,

  async edit(req, res) {
    const id = req.params.id;

    recipe.find(id, (recipeData) => {
      recipe.chefsList((chefsList) => {
        recipe.files(id, (files) => {
          return res.render("admin/recipes/edit", {
            recipe: recipeData,
            chefsList,
            images: files,
          });
        });
      });
    });
  } /* ok */,

  async put(req, res) {
    const keys = Object.keys(req.body);
    const files = req.files;

    // Construct Object to Push into data

    const editedRecipe = [
      req.body.chef_id,
      req.body.title,
      req.body.ingredients,
      req.body.preparation,
      req.body.information,
      req.body.id,
    ];
    
    recipe.update(editedRecipe, files, req.body.removed_files,req.body.id, (callback) => {
      return res.redirect(`/admin/recipes/${req.body.id}`);
    });
  }, /* partil ok */

  async delete(req, res) {
    const { id } = req.body;
    recipe.delete(id, (callback) => {
      return res.redirect("/admin/recipes");
    });
  },
};
