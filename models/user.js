const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: {
    type: String,
    minLength: 1,
    maxLength: 50,
    required: true,
    trim: true
  },
  email: {
    type: String,
    minLength: 1,
    maxLength: 50,
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = User;
