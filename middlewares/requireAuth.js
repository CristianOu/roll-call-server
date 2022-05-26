require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function requireAuth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    console.log('Unauthorized');
    return res.status(401).send({ error: 'You must be logged in.' });
  }

  const token = authorization.replace('Bearer ', '');

  jwt.verify(token, JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: 'Wrong token.' });
    }

    // decoded claims, sort of
    req.user = payload;
    next();
  });
}

module.exports = requireAuth;
