const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ email, password }) {
    const stringPassword = password.toString();
    const passwordHash = await bcrypt.hash(
      stringPassword,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
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
      console.log('usererrr', user);
      if (!user) throw new Error('Invalid email');
      // use built in compareSync method
      if (!bcrypt.compareSync(password, user.passwordHash)) {
        throw new Error('Invalid password');
      }

      // creates our JWT using built in function
      const token = this.getToken(user);
      console.log('tokennn', token);
      return { user, token };
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
};
