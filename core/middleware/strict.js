const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json('Unauthorized');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // append decoded to req so we can access it in the next handler
    req.decoded = decoded;
    return next();
  } catch( error ) {
    return res.status(401).json('Unauthorized');
  }
}

module.exports = {
  authenticate,
}
