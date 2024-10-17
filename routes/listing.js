const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { userAuthenticate } = require("../utils/authenticate.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { cloudinary, storage } = require("../cloudConfig.js");
const upload = multer({ storage });
require("dotenv").config();

router.get("/", wrapAsync(listingController.index));

// Add List Route
router
  .route("/add")
  .get(userAuthenticate, wrapAsync(listingController.addPage))
  .post(upload.single("listing[image]"), wrapAsync(listingController.addReq));

// Info List Route
router.get("/:id/details", wrapAsync(listingController.info));

// Edit List Route
router
  .route("/:id/edit")
  .get(userAuthenticate, wrapAsync(listingController.editPage))
  .put(upload.single("listing[image]"), wrapAsync(listingController.editReq));

// Delete Route
router.get(
  "/:id/remove",
  userAuthenticate,
  wrapAsync(listingController.destroy)
);

module.exports = router;
