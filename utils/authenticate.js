const userAuthenticate = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.url = req.originalUrl;
    req.flash("error", "Please login first");
    res.redirect("/login");
  } else {
    next();
  }
};

const setRedirectUrl = (req, res, next) => {
  res.locals.redirectUrl = req.session.url;
  next();
};

module.exports = { userAuthenticate, setRedirectUrl };
