const pool = require('../../sql/pool');

module.exports = class Sample {
  id;
  profileId;
  url;

  constructor(row) {
    this.id = row.id;
    this.url = row.url;
    this.profileId = row.profile_id;
  }

  static async insert({ url, profileId }) {
    const { rows } = await pool.query(
      `
    INSERT INTO samples (url, profile_id)
    VALUES ($1, $1)
    RETURNING *`,
      [url, profileId]
    );
    return new Sample(rows[0]);
  }
};
