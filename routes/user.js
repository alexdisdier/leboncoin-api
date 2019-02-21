////////////////
// USER ROUTE //
////////////////

const express = require("express");
const router = express.Router();

router.get("/user", (req, res) => {
  res.send({
    message: "user get route"
  });
});

module.exports = router;
