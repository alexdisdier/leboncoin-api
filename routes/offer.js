/////////////////
// OFFER ROUTE //
/////////////////

const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const uploadPictures = require("../middlewares/uploadPictures");
const faker = require("faker");

const Offer = require("../models/offer");

// CREATE
// params body: title, description, price
router.post("/leboncoin-client/publish", isAuthenticated, uploadPictures, (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const user = req.user;
  const pictures = req.pictures;

  let object = {
    title: title,
    description: description,
    price: price,
    creator: user
  };

  if (pictures !== undefined) {
    object.pictures = req.pictures;
  }

  const offer = new Offer(object);

  offer.save(function(error) {
    if (!error) {
      res.send({
        _id: offer._id,
        title: offer.title,
        description: offer.description,
        price: offer.price,
        pictures: offer.pictures,
        creator: {
          account: offer.creator.account,
          _id: offer.creator._id
        },
        created: offer.created
      });
    } else {
      return next(error.message);
    }
  });
});

// READ no count
// params get: id of offer
router.get("/leboncoin-client/offer", async (req, res) => {
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
router.get("/leboncoin-client/offer/with-count", function(req, res) {
  const filter = {};
  if (
    (req.query.priceMin !== undefined && req.query.priceMin !== "") ||
    (req.query.priceMax !== undefined && req.query.priceMax !== "")
  ) {
    filter.price = {};
    if (req.query.priceMin) {
      filter.price["$gte"] = req.query.priceMin;
    }

    if (req.query.priceMax) {
      filter.price["$lte"] = req.query.priceMax;
    }
  }

  if (req.query.title) {
    filter.title = {
      $regex: req.query.title,
      $options: "i"
    };
  }

  Offer.count(filter, (err, count) => {
    const query = Offer.find(filter)
      .populate({
        path: "creator",
        select: "account"
      })
      .sort({ created: -1 });

    if (req.query.skip !== undefined) {
      query.skip(parseInt(req.query.skip));
    }
    if (req.query.limit !== undefined) {
      query.limit(parseInt(req.query.limit));
    } else {
      // valeur par défaut de la limite
      query.limit(100);
    }

    switch (req.query.sort) {
      case "price-desc":
        query.sort({ price: -1 });
        break;
      case "price-asc":
        query.sort({ price: 1 });
        break;
      case "date-desc":
        query.sort({ created: -1 });
        break;
      case "date-asc":
        query.sort({ created: 1 });
        break;
      default:
    }

    query.exec((err, offers) => {
      res.json({ count, offers });
    });
  });
});

// READ no count
// req.params.id of offer
router.get("/leboncoin-client/offer/:id", async (req, res) => {
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
    // console.log(offer);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// DELETE
// params req.params.id of offer and req.header.authorization (user token)
router.delete("/leboncoin-client/delete/:id", isAuthenticated, function(req, res, next) {
  Offer.findOneAndDelete(
    {
      _id: req.params.id,
      creator: req.user
    },
    function(err, obj) {
      if (err) {
        return next(err.message);
      }
      if (!obj) {
        res.status(404);
        return next("Nothing to delete");
      } else {
        return res.json({ message: "Deleted" });
      }
    }
  );
});

// FAKER ROUTE TO GENERATE DEPARTMENTS
router.post(
  "/leboncoin-client/publish-faker",
  isAuthenticated,
  uploadPictures,
  async (req, res, next) => {
    const productNum = 1;
    try {
      for (let i = 0; i < productNum; i++) {
        const offer = new Offer({
          title: faker.fake("{{commerce.productName}}"),
          description: faker.fake("{{hacker.phrase}}"),
          price: faker.fake("{{commerce.price}}"),
          creator: req.user,
          pictures: req.pictures
        });

        await offer.save();
      }
      res.json({
        message: `${productNum} products have been created`
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
);

module.exports = router;
