/////////////////
// OFFER ROUTE //
/////////////////

const express = require("express");
const router = express.Router();

const Offer = require("../models/offer");

// CREATE
// params body: title, description, price, creator (family id of the attributed creator)
router.post("/offer/create", async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;

    const offer = new Offer({
      title: title,
      description: description,
      price: price
    });

    await offer.save();
    res.send({
      message: "success"
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// READ no count
router.get("/offer", async (req, res) => {
  try {
    const offers = await Offer.find();
    const count = await Offer.count();

    if (count.length > 0) {
      console.log(offers);
      res.send(offers);
    } else {
      res.send({
        message: "no offers in database"
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// READ with count
// params get: title, priceMin, priceMax, sort (price-desc, pricer-asc, date-desc, date-asc), skip, limit.
router.get("/offer/with-count", async (req, res) => {
  try {
    const offers = await Offer.find();
    const count = await Offer.count();

    if (count > 0) {
      console.log(offers);
      res.send({
        count: count,
        offers: offers
      });
    } else {
      res.send({
        message: "no offers in database"
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

module.exports = router;
