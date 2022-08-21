var express = require("express");
var router = express.Router();
var User = require("../models/user");
/* GET users listing. */
router.get("/", function (req, res, next) {
  if (req.session.userId) {
    return res.redirect("/ecommerce");
  }
  res.send("respond with a resource");
});

router.get("/register", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/ecommerce");
  }
  var exist = req.flash("exist")[0];
  var min = req.flash("min")[0];
  res.render("register", { exist, min });
});

router.get("/login", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/ecommerce");
  }
  var regsuccess = req.flash("regsuccess")[0];
  var ep = req.flash("ep")[0];
  var email = req.flash("email")[0];
  var password = req.flash("password")[0];
  res.render("login", { regsuccess, ep, email, password });
});

router.post("/register", (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return next(err);
    if (user) {
      req.flash("exist", "Email is already Registered");
      return res.redirect("/users/register");
    }
    if (req.body.password.length <= 5) {
      req.flash("min", "Password is less than 5 characters");
      return res.redirect("/users/register");
    }
    User.create(req.body, (err, userCreated) => {
      if (err) return next(err);
      req.flash("regseccuess", "Registered Successfully");
      return res.redirect("/users/login");
    });
  });
});

router.post("/login", (req, res, next) => {
  req.session.loggedIn = true;
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash("ep", "Email & Password is required");
    return res.redirect("/users/login");
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash("email", "Email is not registered");
      return res.redirect("/users/login");
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash("password", "Password is incorrect");
        return res.redirect("/users/login");
      }
      req.session.userId = user.id;
      req.session.admin = user.admin;
      return res.redirect("/ecommerce");
    });
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect-sid");
  return res.redirect("/users/login");
});

module.exports = router;
