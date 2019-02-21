const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  title: {
    type: String,
    minLength: 1,
    maxLength: 150,
    required: true
  },
  description: {
    type: String,
    minLength: 1,
    maxLength: 250,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Offer;
