const User = require("../models/user");

const isAuthenticated = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    User.findOne(
      {
        token: token
      },
      (error, user) => {
        if (error) {
          return res.status(400).json({
            error: error.message
          });
        }
        if (!user) {
          return res.status(401).json({
            error: "Unauthorized"
          });
        } else {
          req.user = user;
          return next();
        }
      }
    );
  } else {
    return res.status(401).json({
      error: "unauthorized"
    });
  }
};

module.exports = isAuthenticated;
