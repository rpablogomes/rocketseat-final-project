const db = require("../../config/db");

module.exports = {
  recipes(data) {
    let { filter, limit, offset, callback, notFound } = data;

    db.query(
      `
      SELECT recipes.id, recipes.title, chefs.name as chefs_name,(
        SELECT COUNT(recipes) AS total FROM recipes WHERE title ILIKE '%${filter}%'
      )
          
      FROM recipes
      
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      
      WHERE title ILIKE '%${filter}%'
      
      ORDER BY recipes.id ASC

      LIMIT ${limit} OFFSET ${offset}
  `,
      (error, results) => {

        if (!results.rows[0] || error) return notFound();

        total = String(Math.ceil(results.rows[0].total / limit));

        pagination = {
          filter,
          total,
          page: String(Math.ceil((offset + 1) / limit)),
        };

        callback(results.rows, pagination);
      }
    );
  },
  recipe(id, callback) {
    db.query(
      `
    SELECT *
                
    FROM recipes
            
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)

    WHERE recipes.id = ${id}

    ORDER BY recipes.id ASC`,
      (err, results) => {
        if (err) throw "Database";
        callback(results.rows[0]);
      }
    );
  },
  chefs(callback) {
    query = `SELECT chefs.id, chefs.name, chefs.avatar_url, COUNT(chef_id) AS total_recipes

    FROM chefs

    LEFT JOIN recipes ON (chefs.id = recipes.chef_id)

    GROUP BY chefs.id, chefs.name, chefs.avatar_url`;

    db.query(query, function (err, results) {
      if (err) throw "Database";
      callback(results.rows);
    });
  },
};
