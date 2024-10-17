const mongoose = require("mongoose");
const { type } = require("../schema");
const Reviews = require("./reviews.js");
const { Schema } = mongoose;
const defaultImg =
  "https://images.unsplash.com/photo-1515362778563-6a8d0e44bc0b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// Schema
const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    filename: { type: String, default: "listingimage" },
    url: { type: String, default: defaultImg },
  },
  price: Number,
  location: String,
  country: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      requied: true,
    },
  },
});
// listingSchema.pre("save", async () => {
//   console.log("Mongoose Pre Middleware");
// });

listingSchema.post("findOneAndDelete", async (lists) => {
  if (lists) {
    await Reviews.deleteMany({ _id: { $in: lists.review } });
  }
});

// Models
const Listing = mongoose.model("Listing", listingSchema);

// Exports
module.exports = Listing;
