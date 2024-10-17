const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");
const Reviews = require("../models/reviews.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const methodOverride = require("method-override");
const { userAuthenticate } = require("../utils/authenticate.js");
const reviewController = require("../controllers/review.js");

// Middleware
router.use(methodOverride("_method"));
const validReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log(error);
    throw new ExpressError(400, "Invalid Data");
  }
  next();
};

// Review
router.post("/:id/add/review", wrapAsync(reviewController.addRev));

// Delete Review
router.get(
  "/:id/remove/:revId/review",
  userAuthenticate,
  wrapAsync(reviewController.destroy)
);

module.exports = router;
