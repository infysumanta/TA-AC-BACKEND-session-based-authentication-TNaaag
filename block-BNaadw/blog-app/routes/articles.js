let express = require("express");
let router = express.Router();

let Comment = require("../models/Comment");
let Article = require("../models/Article");

//render article create form
router.get("/new", (req, res, next) => {
  if (req.session.userId) {
    console.log(req.session.userId);
    res.render("articleCreateForm");
  } else {
    req.flash("error", "Login/Register first");
    res.redirect("/users/login");
  }
});

//create article
router.post("/", (req, res, next) => {
  Article.create(req.body, (err, article) => {
    if (err) return next(err);
    res.redirect("/articles");
  });
});

//display entire article
router.get("/", (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render("articleList", { articles });
  });
});

//display a specific article
router.get("/:slug", (req, res, next) => {
  let slug = req.params.slug;
  if (req.session.userId) {
    Article.findOne({ slug })
      .populate("comments")
      .exec((err, article) => {
        if (err) return next(err);
        // console.log(article);
        res.render("articleDetails", { article });
      });
  } else {
    req.flash("error", "Login/Register first");
    res.redirect("/users/login");
  }
});

//render article edit form
router.get("/:slug/edit", (req, res, next) => {
  let slug = req.params.slug;
  Article.findOne({ slug }, (err, article) => {
    if (err) return next(err);
    res.render("articleUpdateForm", { article });
  });
});

//edit article
router.post("/:slug", (req, res, next) => {
  let slug = req.params.slug;
  Article.findOneAndUpdate({ slug }, req.body, (err, article) => {
    if (err) return next(err);
    res.redirect("/articles/" + slug);
  });
});

//delete article
router.get("/:slug/delete", (req, res, next) => {
  let slug = req.params.slug;
  Article.findOneAndDelete({ slug }, (err, article) => {
    if (err) return next(err);
    Comment.deleteMany({ articleId: slug }, (err, comments) => {
      if (err) return next(err);
      console.log(comments);
      res.redirect("/articles");
    });
  });
});

//increment like
router.get("/:slug/like", (req, res, next) => {
  let slug = req.params.slug;
  Article.findOneAndUpdate({ slug }, { $inc: { likes: 1 } }, (err, article) => {
    if (err) return next(err);
    res.redirect("/articles/" + slug);
  });
});

//creating comment
router.post("/:slug/comments", (req, res, next) => {
  let slug = req.params.slug;
  Article.findOne({ slug }, (err, article) => {
    if (err) return next(err);
    req.body.articleId = slug;
    Comment.create(req.body, (err, comment) => {
      if (err) return next(err);
      console.log(comment);
      Article.findOneAndUpdate(
        { slug },
        { $push: { comments: comment.id } },
        (err, article) => {
          if (err) return next(err);
          res.redirect("/articles/" + slug);
        }
      );
    });
  });
});
module.exports = router;
