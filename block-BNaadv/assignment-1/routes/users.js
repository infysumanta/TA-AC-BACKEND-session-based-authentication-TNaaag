var express = require("express");
var router = express.Router();
var User = require("../models/User");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("profile");
});

router.get("/login", function (req, res, next) {
  var error = req.flash("error");
  res.render("login", { error });
});

router.post("/login", function (req, res, next) {
  let { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Please enter email and password");
    return res.redirect("/users/login");
  }
  User.findOne({ email }, function (err, user) {
    if (err) return next(err);
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/users/login");
    }
    user.verifyPassword(password, function (err, isMatch) {
      if (err) return next(err);
      if (!isMatch) {
        req.flash("error", "Wrong Password!");
        return res.redirect("/users/login");
      } else {
        req.session.userId = user.id;
        return res.redirect("/users");
      }
    });
  });
});

router.get("/register", function (req, res, next) {
  var error = req.flash("error");
  res.render("register", { error });
});

router.post("/register", function (req, res, next) {
  let { email, password } = req.body;
  if (password.length <= 5) {
    req.flash("error", "Password must be at least 5 characters long");
    return res.redirect("/users/register");
  }
  User.findOne({ email: email }, function (err, user) {
    if (err) return next(err);
    if (user) {
      req.flash("error", "Email already Exist!");
      return res.redirect("/users/register");
    }
    User.create(req.body, function (err, user) {
      if (err) return next(err);
      res.redirect("/users/login");
    });
  });
});

module.exports = router;
