const jwt = require("jsonwebtoken");
const secret = 'encx404key';

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    // return res.status(403).send("<h2>A token is required for authentication</h2>");

    return res.status(403).send("<h3>You don't have permission for this</h3>");
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;