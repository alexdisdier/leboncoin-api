/////////////////
// OFFER ROUTE //
/////////////////

const express = require("express");
const router = express.Router();

const Offer = require("../models/offer");
const User = require("../models/user");

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
    const count = await Offer.countDocuments();

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
    const count = await Offer.countDocuments();

    if (count > 0) {
      // Setting up all the filters possible
      const filters = {};

      if (req.query.title) {
        filters.title = new RegExp(req.query.title, "i");
      }
      if (req.query.priceMin) {
        filters.price = {
          $gte: req.query.priceMin
        };
      }
      if (req.query.priceMax) {
        if (filters.price) {
          filters.price.$lte = req.query.priceMax;
        } else {
          filters.price = {
            $lte: req.query.priceMax
          };
        }
      }

      const search = await Offer.find(filters)
        .populate("User")
        .skip(Number(req.query.skip))
        .limit(Number(req.query.limit));

      // Sorting the offers
      if (req.query.sort === "price-asc") {
        search.sort({
          price: 1
        });
      } else if (req.query.sort === "price-desc") {
        search.sort({
          price: -1
        });
      }

      if (req.query.sort === "rating-asc") {
        search.sort({
          averageRating: 1
        });
      } else if (req.query.sort === "rating-desc") {
        search.sort({
          averageRating: -1
        });
      }
      res.json({
        count: search.length,
        offers: search
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
