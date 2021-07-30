const db = require("../../config/db");
const chef = require("../models/chef");
const getSince = require("../lib/utils").getSince;

exports.index = function (req, res) {
  chef.index((callback) => {
    return res.render("admin/chefs/chefs", { chefs : callback });
  });
};

exports.create = function (req, res) {
  res.render(`admin/chefs/chef_create`);
};

exports.post = function (req, res) {
  const keys = Object.keys(req.body);

  //validation
  for (key of keys) {
    if (req.body[key] == "") {
      return res.send("Fill all the fields");
    }
  }

  const values = [req.body.name, req.body.avatar_url, getSince()];

  // Construct Object to Push into data

  chef.create(values, (id) => {
    return res.redirect(`chef/${id}`);
  });
};

exports.show = function (req, res) {
  chef.find(req.params.id, (callback) => {
    chef.recipeByChef(req.params.id, recipes => {
      console.log(callback, recipes)
      res.render("admin/chefs/chef", { chef: callback , recipes });
    })
  });
};

exports.edit = function (req, res) {
  const idToCheck = req.params.id;

  foundrecipe = chef.find(idToCheck, (callback) => {

    if(callback.total_recipes == 0) 
    deletePossibility =  true 
    else deletePossibility = false
    
    let { id, name, avatar_url } = callback;
    
    const chef = {
      id,
      name,
      avatar_url,
      deletePossibility
    };

    console.log(chef)
    
    return res.render("admin/chefs/chef_edit", { chef });
  });
};

exports.put = function (req, res) {
  const chefToUpdate = {
    ...req.body,
  };

  const {id} = req.body

  chef.update(chefToUpdate, callback =>{
    return res.redirect(`/admin/chef/${id}`);
  })
};

exports.delete = function (req, res) {
  const { id }  = req.body;

  chef.delete(id, callback => {
    return res.redirect("/admin/chefs");
  })
};