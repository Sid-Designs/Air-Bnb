const Listing = require("../models/listings.js");
const Reviews = require("../models/reviews.js");

module.exports.addRev = async (req, res) => {
  const { id } = req.params;
  const newReview = req.body;
  newReview.author = req.user._id;
  const filterReview = new Reviews(newReview);
  console.log(newReview);
  await filterReview.save();
  const lists = await Listing.findById(id);
  lists.review.push(filterReview._id);
  await lists.save();
  req.flash("success", "Your Review Is Added");
  res.redirect(`/hotels/${id}/details`);
};

module.exports.destroy = async (req, res) => {
  const { id, revId } = req.params;
  const review = await Reviews.findById(revId);
  if (!review.author._id.equals(req.user._id)) {
    req.flash("error", "You Can't Edit Other's Review");
    return res.redirect(`/hotels/${id}/details`);
  }
  await Listing.findByIdAndUpdate(id, { $pull: { review: revId } });
  await Reviews.findByIdAndDelete(revId);
  req.flash("success", "Your Review Is Deleted");
  res.redirect(`/hotels/${id}/details`);
};
