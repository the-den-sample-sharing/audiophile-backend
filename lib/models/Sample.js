const pool = require('../../sql/pool');

module.exports = class Sample {
  id;
  userId;
  url;

  constructor(row) {
    this.id = row.id;
    this.url = row.url;
    this.userId = row.user_id;
  }

  static async insert({ url, userId }) {
    const { rows } = await pool.query(
      `
    INSERT INTO samples (url, user_id)
    VALUES ($1, $2)
    RETURNING *`,
      [url, userId]
    );
    return new Sample(rows[0]);
  }
};
