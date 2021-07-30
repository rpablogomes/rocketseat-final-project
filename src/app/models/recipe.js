const db = require("../../config/db");
const File = require("./file");

module.exports = {
  index(callback) {
    query = `SELECT recipes.id, title, chefs.name as chef_name

    FROM recipes
                
    LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
    
    LEFT JOIN recipe_files ON (recipe_files.recipe_id = recipes.id)
    
    LEFT JOIN files ON (files.id = recipe_files.file_id)
    
    ORDER BY recipes.id ASC
    `;

    db.query(query, (err, results) => {
      if (err) throw "Database";

      console.log(results.rows)

      callback(results.rows);
    });
  }, /* ok */
  chefsList(chefsList) {
    db.query("SELECT id, name FROM chefs", function (err, results) {
      chefsList(results.rows);
    });
  } /* ok */,
  findBy(filter, callback) {
    db.query(
      `SELECT chefs.id, chefs.name, chefs.avatar_url, chefs.subjects_taught, COUNT(students) AS total_students
        
        FROM chefs
        
        LEFT JOIN students ON (students.chef_id = chefs.id)
        
        WHERE chefs.name ILIKE '%${filter}%'
        
        GROUP BY chefs.id
        
        ORDER BY chefs.id ASC`,

      function (err, results) {
        if (err) return (res.send = "Database error!!!");

        callback(results.rows);
      }
    );
  },
  async create(values, files, callback) {
    // Construct Object to Push to front-end

    const query = `
    INSERT INTO recipes (
      chef_id,
      title,
      ingredients,
      preparation,
      information,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
`;

    db.query(query, values, async (err, results) => {
      if (err) throw err;
      const recipeId = await results.rows[0].id;

      if (files != 0) {
        const newFilesPromise = await files.map(async (files) => {
          await File.createFile(files, recipeId);
        });
        await Promise.all(newFilesPromise);
      }
      callback(recipeId);
    });
  } /* ok */,
  find(id, callback) {
    db.query(
      `
    SELECT recipes.id, chef_id, title, ingredients, preparation, information, chefs.name as chef_name 

    FROM recipes

    LEFT JOIN chefs ON (chefs.id = recipes.chef_id)

    where recipes.id = '${id}'

    ORDER BY chefs ASC`,
      (err, results) => {
        if (results.rows == [] || err) throw "Database error!!!";
        callback(results.rows[0]);
      }
    );
  } /* ok */,
  async update(editedRecipe, files, removed_files, id, callback) {

      if (files != 0) {
      const newFilesPromise = files.map(file => {File.createFile(file, id)})
      await Promise.all(newFilesPromise);
      }

      if (removed_files) {
      const removedFiles = removed_files.split(",");
      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1);

      const removedFilesPromise = removedFiles.map(async (id) => {
        await File.delete(id);
      });
      await Promise.all(removedFilesPromise);
  }

    const query = `UPDATE recipes SET
            chef_id=($1),
            title=($2),
            ingredients=($3),
            preparation=($4),
            information=($5)
      WHERE id = $6`;

    db.query(query, editedRecipe, (err, results) => {
      if (err) throw `Database Error! ${err}`;
      callback();
    });
  } /* partial ok */,
  async delete(id, callback) {

    db.query(`DELETE FROM recipes WHERE id = ${id}`, (err, results) => {
      db.query(`DELETE FROM recipe_files WHERE recipe_id = ${id} RETURNING file_id`, (err, results) => {
        results.rows.map(file_id => {
          db.query(`DELETE FROM files WHERE recipe_id = ${file_id.file_id}`, (err, results) => {
      if (err) throw "Database Error!";
    })})})})
      callback();
  },
  files(id, files) {
    db.query(
      `
    SELECT recipe_files.id, path, name

    FROM recipe_files
    
    JOIN files ON files.id = recipe_files.file_id

    WHERE recipe_id = '${id}'
`,
      (err, results) => {
        if (results.rows == [] || err) throw "Database error!!!";
        return files(results.rows);
      }
    );
  },
  deleteFiles(id, callback) {
    db.query(`DELETE FROM recipes_files WHERE id = ${id}`, (err, results) => {
      if (results.rows == [] || err) throw "Database error!!!";
      console.log(results);
      callback();
    });
  },
};
