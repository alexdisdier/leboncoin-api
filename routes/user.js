////////////////
// USER ROUTE //
////////////////

const express = require("express");
const router = express.Router();

const User = require("../models/user");

// CREATE
// Params body:
router.post("/user/sign_up", async (req, res) => {
  try {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    if (email && username && password) {
      const user = new User({
        username: username,
        email: email,
        password: password
      });
      await user.save();
      res.json({
        message: "user created",
        user
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// READ
router.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    const count = await User.count();

    if (count > 0) {
      res.json({
        count: count,
        users
      });
    } else {
      res.json({
        message: "no users in the database"
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

module.exports = router;
