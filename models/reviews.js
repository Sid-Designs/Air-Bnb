const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema
const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Model
const Reviews = mongoose.model("Review", reviewSchema);

// Export
module.exports = Reviews;
