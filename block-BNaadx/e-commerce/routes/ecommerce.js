var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Product = require("../models/product");

router.get("/", (req, res) => {
  console.log(req.session);
  Product.find({}, (err, products) => {
    if (err) return next(err);
    res.render("dashboard", { products });
  });
});

router.get("/new", (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/ecommerce");
  }
  res.render("addProduct");
});

router.post("/", (req, res, next) => {
  Product.create(req.body, (err, product) => {
    if (err) return next(err);
    return res.redirect("/ecommerce");
  });
});

router.get("/:id", (req, res, next) => {
  var id = req.params.id;
  Product.findById(id, (err, product) => {
    if (err) return next(err);
    var userId = req.session.userId;
    User.findById(userId, (err, user) => {
      if (err) return next(err);
      res.render("singleProduct", { product, user });
    });
  });
});

router.get("/:id/like", (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/ecommerce");
  }
  var id = req.params.id;
  Product.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, product) => {
    if (err) return next(err);
    return res.redirect("/ecommerce/" + id);
  });
});

router.get("/:id/cart", (req, res, next) => {
  var productId = req.params.id;
  var userId = req.session.userId;
  User.findByIdAndUpdate(
    userId,
    { $push: { cart: productId } },
    (err, user) => {
      if (err) return next(err);
      Product.findByIdAndUpdate(
        productId,
        { $inc: { quantity: -1 } },
        (err, product) => {
          if (err) return next(err);
          return res.redirect("/ecommerce/" + productId);
        }
      );
    }
  );
});

module.exports = router;
