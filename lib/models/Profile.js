const pool = require('../../sql/pool');

module.exports = class Profile {
  userId;
  username;
  firstName;
  lastName;

  constructor(row) {
    this.userId = row.user_id;
    this.username = row.username;
    this.firstName = row.first_name;
    this.lastName = row.last_name;
  }

  static async insert({ username, firstName, lastName }) {
    const { rows } = await pool.query(
      `
    INSERT INTO profiles (username, first_name, last_name)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
      [username, firstName, lastName]
    );
    return new Profile(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM profiles');

    return rows.map((row) => new Profile(row));
  }
};
