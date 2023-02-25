const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    // console.log('cookiess', req.cookies);
    const cookie = req.cookies[process.env.COOKIE_NAME];
    // Check the httpOnly session cookie for the current user
    if (!cookie) throw new Error('You must be signed in to continue');

    // Verify the JWT token stored in the cookie, then attach to each request
    const user = jwt.verify(cookie, process.env.JWT_SECRET);
    req.user = user;
    req.token = cookie; // Attach the cookie to a new property on the request object
    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};
