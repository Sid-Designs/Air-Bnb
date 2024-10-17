const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const mongoose = require("mongoose");
const Listing = require("../models/listings.js");
const User = require("../models/users.js");
const passport = require("passport");
const ExpressError = require("../utils/ExpressError.js");
const {
  userAuthenticate,
  setRedirectUrl,
} = require("../utils/authenticate.js");

// SignUp
router.get("/signup", (req, res) => {
  const total = 0;
  res.render("users/signup.ejs", { total });
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          next(err);
        } else {
          req.flash("success", "Welcome!");
          res.redirect("/");
        }
      });
    } catch (e) {
      console.log(e.message);
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

// Login
router.get("/login", (req, res) => {
  const total = 0;
  res.render("users/login.ejs", { total });
});

router.post(
  "/login",
  setRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    let redirectUrl = res.locals.redirectUrl || "/";
    req.flash("success", "You successfully logged in");
    res.redirect(redirectUrl);
  })
);

// LogOut
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", "Error Occurred");
      next(err);
    }
    req.flash("success", "You successfully logged out");
    res.redirect("/");
  });
});

module.exports = router;
