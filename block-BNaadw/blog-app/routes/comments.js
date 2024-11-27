let express = require("express");
let router = express.Router();
let Comment = require("../models/Comment");
let Article = require("../models/Article");

//get comment edit form
router.get("/:id/edit", (req, res, next) => {
  let id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    res.render("updateCommentForm", { comment });
  });
});

//update comment
router.post("/:id", (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
    if (err) return next(err);
    res.redirect("/articles/" + comment.articleId);
  });
});

//delete comments
router.get("/:id/delete", (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndDelete(id, (err, comment) => {
    if (err) return next(err);
    Article.findOneAndUpdate(
      { slug: comment.articleId },
      { $pull: { comments: comment.id } },
      (err, article) => {
        if (err) return next(err);
        res.redirect("/articles/" + article.slug);
      }
    );
  });
});

//like comments
router.get("/:id/likes", (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, comment) => {
    if (err) return next(err);
    res.redirect("/articles/" + comment.articleId);
  });
});

module.exports = router;
