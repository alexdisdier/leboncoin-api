////////////////
// USER ROUTE //
////////////////

const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/user");

// CREATE
// Params body:
router.post("/user/sign_up", async (req, res) => {
  try {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    const token = uid2(16); // MaxLengh in user model set to 17.
    const salt = uid2(16); // MaxLengh in user model set to 17.
    const hash = SHA256(password + salt).toString(encBase64);

    if ((email || username) && password) {
      const user = new User({
        token: "kjag;dag",
        salt: salt,
        username: username,
        email: email,
        password: hash
      });
      await user.save();
      res.json({
        _id: user._id,
        token: token,
        account: {
          username: username,
          email: email
        }
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

// READ
// params body: email, password
router.post("/user/log_in", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.find({ email: email });

    if (SHA256(password + user.salt).toStringBase64 === user.hash) {
      console.log(user[0]);
      res.send({
        _id: user[0]._id,
        token: user[0].token,
        account: {
          username: user[0].username,
          email: user[0].email
        }
      });
    } else {
      res.send({
        message: "wrong password"
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

module.exports = router;
