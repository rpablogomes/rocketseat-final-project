const db = require("../../config/db");
const fs = require("fs");

module.exports = {
  async createFile(file, recipeId) {

    const values = [file.filename, file.path];

    const query = `
      INSERT INTO files (
        name,
        path
      )
      VALUES ($1, $2)
      RETURNING id
  `;

    db.query(query, values, async (err, results) => {
      if (err) throw err;

        const fileId = await results.rows[0].id;

        const values2 = [recipeId, fileId];

      const query2 = `
    INSERT INTO recipe_files (
      recipe_id,
      file_id
    )
    VALUES ($1, $2)
`;

      db.query(query2, values2, (err, results) => {
        if (err) throw err;
        return;
      });
    });

    return;
  }, /* ok */
  async delete(id) {
    try {

      const recipes_files = await db.query(`SELECT file_id FROM recipe_files WHERE id = $1`, [id]);
      const fileResults = await db.query(`SELECT * FROM files WHERE id = $1`, [recipes_files.rows[0].file_id]);
      const file = fileResults.rows[0];


      fs.unlink(file.path, (err) => {
        if (err) throw err;
        return db.query(`DELETE FROM recipe_files WHERE file_id = $1 RETURNING file_id`, [file.id],
        (err, results) => db.query(`DELETE FROM files WHERE id = $1 `, [results.rows[0].file_id]));
      })
    } catch (err) {
      console.log(err);
    }
  },
};
