var express = require("express");
var router = express.Router();
var User = require("../models/User");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/register", function (req, res, next) {
  res.render("register");
});
router.post("/register", function (req, res, next) {
  User.create(req.body, function (err, user) {
    if (err) {
      console.log(err);
      res.render("/users/register");
    } else {
      res.redirect("/users/login");
    }
  });
});

router.get("/login", function (req, res, next) {
  res.render("login");
});
router.post("/login", function (req, res, next) {});

module.exports = router;
