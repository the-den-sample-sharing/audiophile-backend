const pool = require('../../sql/pool');

module.exports = class Studio {
  id;
  name;
  city;
  country;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.city = row.city;
    this.country = row.country;
  }

  static async insert({ name, city, country }) {
    const { rows } = await pool.query(
      `
      INSERT INTO studios (name, city, country)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [name, city, country]
    );

    return new Studio(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
      SELECT id, name, city, country
      FROM   studios
    `,
      []
    );
    return rows.map((row) => new Studio(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT id, name, city, country
      FROM   studios
      WHERE  id = $1;
    `,
      [id]
    );

    return rows.length ? new Studio(rows[0]) : null;
  }

  static async update(id, studio) {
    const { rowCount } = await pool.query(
      `
UPDATE studios SET name = $2, city = $3, country = $4 WHERE id = $1;
`,
      [id, studio.name, studio.city, studio.country]
    );
    return rowCount;
  }

  static async del(id) {
    const { rowCount } = await pool.query(
      `
       DELETE from studios WHERE id = $1;
`,
      [id]
    );
    return rowCount;
  }
};
