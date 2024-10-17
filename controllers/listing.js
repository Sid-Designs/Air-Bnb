const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { response, query } = require("express");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const lists = await Listing.find();
  const total = await Listing.countDocuments();
  res.render("show.ejs", { lists, total });
};

module.exports.info = async (req, res) => {
  const { id } = req.params;
  const lists = await Listing.findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  const total = await Listing.countDocuments();
  if (!lists) {
    req.flash("error", "These Hotel Doesn't Exists");
    res.redirect("/hotels");
    throw new ExpressError(404, "List not found");
  } else {
    res.render("info.ejs", { lists, total });
  }
};

module.exports.addPage = async (req, res) => {
  const total = await Listing.countDocuments();
  res.render("add.ejs", { total });
};

module.exports.addReq = async (req, res) => {
  try {
    const url = req.file.path;
    const fileName = req.file.filename;
    const { listing } = req.body;
    const { error } = listingSchema.validate(listing);
    if (error) {
      throw new ExpressError(400, "Enter Valid Data");
    } else {
      let response = await geocodingClient
        .forwardGeocode({
          query: req.body.listing.location,
          limit: 1,
        })
        .send();
      const list = new Listing(listing);
      list.owner = req.user;
      list.image = { url, fileName };
      list.geometry = response.body.features[0].geometry;
      await list.save();
      req.flash("success", "Your New Hotel Is Added");
      console.log(req.file);
    }
    res.redirect("/");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/hotels/add");
  }
};

module.exports.editPage = async (req, res) => {
  const { id } = req.params;
  const lists = await Listing.findById(id);
  if (!lists.owner._id.equals(req.user._id)) {
    req.flash("error", "You Don't Have The Permissions");
    return res.redirect(`/hotels/${id}/details`);
  }
  const total = await Listing.countDocuments();
  res.render("edit.ejs", { lists, total });
};

module.exports.editReq = async (req, res) => {
  const { id } = req.params;
  const newListing = { ...req.body };
  if (typeof req.file != "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;
    newListing.image = { url, filename };
  }
  const result = await Listing.findByIdAndUpdate(id, newListing);
  req.flash("success", "Hotel Info Edited");
  res.redirect(`/hotels/${id}/details`);
};

module.exports.destroy = async (req, res) => {
  const { id } = req.params;
  const lists = await Listing.findById(id);
  if (!lists.owner._id.equals(req.user._id)) {
    req.flash("error", "You Don't Have The Permissions");
    return res.redirect(`/hotels/${id}/details`);
  }
  const listings = await Listing.findByIdAndDelete(id);
  if (!listings) {
    throw new ExpressError(404, "List not found");
  }
  req.flash("success", "Hotel Removed");
  res.redirect("/");
};
