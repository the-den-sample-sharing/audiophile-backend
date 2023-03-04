const pool = require('../../sql/pool');

module.exports = class ProfileAvatar {
  profileId;
  avatarUrl;

  constructor(row) {
    this.profileId = row.profile_id;
    this.avatarUrl = row.avatar_url;
  }

  static async insert({ avatarUrl, profileId }) {
    const { rows } = await pool.query(
      `
    INSERT INTO profile_avatars (avatar_url, profile_id)
    VALUES ($1, $2)
    RETURNING *
    `,
      [avatarUrl, profileId]
    );
    return new ProfileAvatar(rows[0]);
  }
};
