const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ username, firstName, lastName, email, password }) {
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
      username,
      firstName,
      lastName,
      email,
      passwordHash,
    });

    const token = this.getToken(user);

    return { user, token };
  }

  static getToken(user) {
    // creates our JWT using built in function
    return jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });
  }

  static async signIn({ email, password = '' }) {
    try {
      const user = await User.getByEmail(email);

      if (!user) throw new Error('Invalid email');
      // use built in compareSync method
      if (!bcrypt.compareSync(password, user.passwordHash)) {
        throw new Error('Invalid password');
      }

      // creates our JWT using built in function
      const token = this.getToken(user);

      return { user, token };
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
};
