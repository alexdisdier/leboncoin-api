/////////////////
// OFFER ROUTE //
/////////////////

const express = require("express");
const router = express.Router();

const uploadPictures = require("../middlewares/uploadPictures");

const Offer = require("../models/offer");
const User = require("../models/user");

// CREATE
// params body: title, description, price
router.post("/publish", uploadPictures, async (req, res) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer ", "");
      const title = req.body.title;
      const description = req.body.description;
      const price = req.body.price;
      const user = await User.findOne({ token: token });
      const pictures = req.pictures;

      const offer = new Offer({
        title: title,
        description: description,
        price: price,
        pictures: pictures,
        creator: user
      });

      await offer.save();

      res.send({
        _id: offer._id,
        title: offer.title,
        description: offer.description,
        price: offer.price,
        pictures: offer.pictures,
        creator: {
          account: user.account,
          _id: user._id
        },
        created: offer.created
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// READ no count
// params get: id of offer
router.get("/offer", async (req, res) => {
  try {
    const offers = await Offer.find();

    if (offers.length > 0) {
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
        search.sort((a, b) => {
          return a.price - b.price;
        });
      } else if (req.query.sort === "price-desc") {
        search.sort((a, b) => {
          return b.price - a.price;
        });
      }

      if (req.query.sort === "date-asc") {
        search.sort((a, b) => {
          return a.date - b.date;
        });
      } else if (req.query.sort === "date-desc") {
        search.sort((a, b) => {
          return b.date - a.date;
        });
      }

      const offers = await search;

      res.json({
        count: offers.length,
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

// READ no count
// params get: :id of offer
router.get("/offer/:id", async (req, res) => {
  try {
    const offerId = req.params.id;
    offer = await Offer.findById(offerId).populate({
      path: "creator",
      model: "User",
      select: { account: 1 }
    });

    if (offer) {
      res.send(offer);
    } else {
      res.send({
        message: "no offer with this id"
      });
    }
    console.log(offer);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

module.exports = router;
