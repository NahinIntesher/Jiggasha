const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];

  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
    req.userId = decoded.id;
    req.userType = decoded.type;
    next();
  } catch (err) {
    return res.json({ Error: "Invalid token" });
  }
};

module.exports = verifyToken;
