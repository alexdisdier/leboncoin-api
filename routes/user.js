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
router.post("/sign_up", async (req, res) => {
  try {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const phone = req.body.phone;

    const token = uid2(16); // MaxLengh in user model set to 17.
    const salt = uid2(16); // MaxLengh in user model set to 17.
    const hash = SHA256(password + salt).toString(encBase64);

    if ((email || username) && password) {
      const user = new User({
        email: email,
        token: token,
        salt: salt,
        hash: hash,
        account: {
          username: username,
          phone: phone
        }
      });
      await user.save();
      res.json({
        _id: user._id,
        token: user.token,
        account: user.account
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// READ
// params body: email, password
router.post("/log_in", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    if (SHA256(password + user.salt).toString(encBase64) === user.hash) {
      res.send({
        _id: user._id,
        token: user.token,
        emil: user.email,
        account: {
          username: user.username,
          phone: user.phone
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

// READ
router.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    const count = await User.countDocuments();

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
