const pool = require('../../sql/pool');

module.exports = class ProfileAvatar {
  profileId;
  url;

  constructor(row) {
    this.profileId = row.profile_id;
    this.url = row.url;
  }

  static async insert({ url, profileId }) {
    const { rows } = await pool.query(
      `
    INSERT INTO avatars (url, profile_id)
    VALUES ($1, $2)
    RETURNING *
    `,
      [url, profileId]
    );
    return new ProfileAvatar(rows[0]);
  }

  static async getById(userId) {
    const { rows } = await pool.query(
      `
    SELECT * 
    FROM profile_avatars
    WHERE profile_id=$1
    `,
      [userId]
    );

    if (!rows[0]) return null;

    return new ProfileAvatar(rows[0]);
  }
};
