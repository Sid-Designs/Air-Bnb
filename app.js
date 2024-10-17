// ENV
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// Import required modules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listings.js");
const Reviews = require("./models/reviews.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const User = require("./models/users.js");
const passport = require("passport");
const localStrategy = require("passport-local");

// Server Port
const port = 8080;

// Connecting Database
const mongodbUrl = process.env.MONOGO_DB;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(mongodbUrl);
    console.log("Database Connected");
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
}

// Initialize Express App
const app = express();

// Set up view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set up static files directory
app.use(express.static(path.join(__dirname, "public")));

// Set up ejsMate engine
app.engine("ejs", ejsMate);

// Set up express.json and express.urlencoded middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up methodOverride middleware
app.use(methodOverride("_method"));

// Set up session options
const store = MongoStore.create({
  mongoUrl: mongodbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, //Hrs Sec
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// Set up session middleware
app.use(session(sessionOptions));

// Set up flash middleware
app.use(flash());

// Set up passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set up local strategy for passport
passport.use(new localStrategy(User.authenticate()));

// Set up serialize and deserialize user functions for passport
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect to MongoDB
connectToMongoDB();

// Set up routes
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/hotels", listingsRouter);
app.use("/hotels", reviewsRouter);
app.use("/", userRouter);

// Set up home route
app.get(
  "/",
  wrapAsync(async (req, res) => {
    const lists = await Listing.find();
    const total = await Listing.countDocuments();
    res.render("index.ejs", { lists, total });
  })
);

// Set up error handling middleware
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use(async (err, req, res, next) => {
  let { status = 404, msg = "Something Went Wrong!" } = err;
  const total = await Listing.countDocuments();
  res.render("error.ejs", { total, status, msg, err });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on ${port} port!`);
});
