var express = require("express");
var router = express.Router();
var User = require("../models/User");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("users");
});

router.get("/register", function (req, res, next) {
  var error = req.flash("error");
  res.render("register", { error });
});
router.post("/register", function (req, res, next) {
  const { email, password } = req.body;

  if (password.length <= 4) {
    req.flash("error", "Password must be at least 4 characters long");
    return res.redirect("/users/register");
  }

  User.findOne({ email: email }, (err, user) => {
    if (err) return next(err);
    if (user) {
      req.flash("error", "Email already Exist!");
      return res.redirect("/users/register");
    } else {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log(err);
          res.redirect("/users/register");
        } else {
          res.redirect("/users/login");
        }
      });
    }
  });
});

router.get("/login", function (req, res, next) {
  var error = req.flash("error");
  res.render("login", { error });
});
router.post("/login", function (req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    console.log("Email or password is empty");
    req.flash("error", "Email or Password is missing!");
    return res.redirect("/users/login");
  }
  User.findOne({ email: email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      console.log("No user found");
      req.flash("error", "User not registered!");
      return res.redirect("/users/login");
    }
    user.verifyPassword(password, (err, isMatch) => {
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

module.exports = router;
