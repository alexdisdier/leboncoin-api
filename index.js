require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

app.use(helmet());
app.use(bodyParser.json());

/////////////////////////
// DATABASE CONNECTION //
/////////////////////////

mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/leboncoin`, {
  useNewUrlParser: true
});

////////////////////////
// ROUTES DECLARATION //
////////////////////////

app.get("/", (req, res) => {
  res.send({
    message: "homepage"
  });
});

const offer = require("./routes/offer");
const user = require("./routes/user");

app.use(offer);
app.use(user);

/////////////////////
// STARTING SERVER //
/////////////////////

app.all("*", function(req, res) {
  res.status(400).send("Page not found");
});

app.listen(3001, () => {
  console.log("server started");
});
