const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  title: {
    type: String,
    minLength: 5,
    maxLength: 25,
    required: true
  },
  description: {
    type: String,
    minLength: 0,
    maxLength: 500,
    default: "",
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  pictures: {
    type: Array,
    of: String,
    default: []
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
