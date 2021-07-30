const db = require("../../config/db");

module.exports = {
  index(callback) {
    query = `SELECT chefs.id, chefs.name, chefs.avatar_url, COUNT(chef_id) AS total_recipes

    FROM chefs

    LEFT JOIN recipes ON (chefs.id = recipes.chef_id)

    GROUP BY chefs.id, chefs.name, chefs.avatar_url`;

    db.query(query, function (err, results) {
      if (err) throw "Database";
      callback(results.rows);
    });
  },
  create(data, callback) {
    // Construct Object to Push to front-end

    const values = data;

    const query = `
        INSERT INTO chefs (
          name,
          avatar_url,
          created_at
        )
        VALUES ($1, $2, $3)
        RETURNING id
    `;

    db.query(query, values, function (err, results) {
      if (err) throw "Database error!!!";
      callback(results.rows[0].id);
    });
  },
  find(id, callback) {
    db.query(
      `SELECT chefs.id, chefs.avatar_url, chefs.name, COUNT (chef_id) AS total_recipes

    FROM chefs
    
    LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
    
    WHERE chefs.id = ${id}
    
    GROUP BY chefs.id`,
      function (err, results) {
        if (results.rows == [] || err)
          return callback.send("Database error!!!");
        callback(results.rows[0]);
      }
    );
  },
  recipeByChef(id, callback) {
    db.query(`SELECT * FROM recipes WHERE chef_id = ${id}`, (err, results) => {
      callback(results.rows);
    });
  },
  update(data, callback) {
    const query = `
            UPDATE chefs SET
            avatar_url=($1),
            name=($2)
            WHERE id = $3`;

    const values = [
      (avatar_url = data.avatar_url),
      (name = data.name),
      (id = data.id),
    ];

    db.query(query, values, (err, results) => {
      if (err) throw `Database Error! ${err}`;

      callback();
    });
  },
  delete(id, callback) {
    db.query(`DELETE FROM chefs WHERE id = ${id}`, (err, results) => {
      if (err) return res.send("Database Error!");

      callback();
    });
  },
};
