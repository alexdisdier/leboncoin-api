const cloudinary = require("cloudinary");
// source: https://cloudinary.com/documentation/node_image_manipulation
const User = require("../models/user");
const uid2 = require("uid2");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadPictures = (req, res, next) => {
  let pictures = req.body.pictures;
  let picturesArr = [];
  let pictureUploaded = 0;

  if (pictures && pictures.length > 0) {
    pictures.map(picture => {
      let random = "user-" + uid2(16);
      cloudinary.v2.uploader.upload(
        picture,
        {
          public_id: `leboncoin-api/userId-${req.user._id}/${random}`
        },
        (error, result) => {
          // console.log(result, error);
          if (error) {
            return res.status(500).json({ error });
          }
          picturesArr.push(result);
          pictureUploaded++;

          if (pictureUploaded === pictures.length) {
            req.pictures = picturesArr;
            next();
          }
        }
      );
    });
  } else {
    next();
  }
};

module.exports = uploadPictures;
