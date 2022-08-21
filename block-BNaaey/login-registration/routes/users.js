var express = require("express");
var router = express.Router();
var User = require("../models/User");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("users");
});

router.get("/register", function (req, res, next) {
  res.render("register");
});
router.post("/register", function (req, res, next) {
  User.create(req.body, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/users/register");
    } else {
      res.redirect("/users/login");
    }
  });
});

router.get("/login", function (req, res, next) {
  res.render("login");
});
router.post("/login", function (req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    console.log("Email or password is empty");
    return res.redirect("/users/login");
  }
  User.findOne({ email: email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      console.log("No user found");
      return res.redirect("/users/login");
    }
    user.verifyPassword(password, (err, isMatch) => {
      if (err) return next(err);
      if (!isMatch) {
        return res.redirect("/users/login");
      } else {
        req.session.userId = user.id;
        return res.redirect("/users");
      }
    });
  });
});

module.exports = router;
