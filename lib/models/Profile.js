const pool = require('../../sql/pool');

module.exports = class Profile {
  userId;
  username;
  firstName;
  lastName;
  bio;
  avatarUrl;

  constructor(row) {
    this.userId = row.user_id;
    this.username = row.username;
    this.firstName = row.first_name;
    this.lastName = row.last_name;
    this.bio = row.bio;
    this.avatarUrl = row.avatar_url;
  }

  static async insert({
    userId,
    username,
    firstName,
    lastName,
    bio,
    avatarUrl,
  }) {
    const { rows } = await pool.query(
      `
    INSERT INTO profiles (user_id, username, first_name, last_name, bio, avatar_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
      [userId, username, firstName, lastName, bio, avatarUrl]
    );
    return new Profile(rows[0]);
  }

  static async getById(userId) {
    const { rows } = await pool.query(
      `
    SELECT * 
    FROM profiles
    WHERE user_id=$1
    `,
      [userId]
    );

    if (!rows[0]) return null;

    return new Profile(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM profiles');

    return rows.map((row) => new Profile(row));
  }
};
