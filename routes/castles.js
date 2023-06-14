const express = require("express");
const router = express.Router();
//utils & models
const wrapAsync = require("../utils/wrapAsync");
const Castle = require("../models/castle");
//middleware
const { isLoggedIn, verifyAuthor, validateCastle } = require("../middleware")

// Routes
router.get("/", wrapAsync(async (req, res) => {
  const castles = await Castle.find({});
  res.render("castles/index", { castles });
})
);
// Create form route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("castles/new");
});

// Create post route
router.post("/", isLoggedIn, validateCastle, wrapAsync(async (req, res) => {
  const castle = new Castle(req.body.castle);
  castle.author = req.user._id;
  await castle.save();
  req.flash('success', 'Successfully built a castle.');
  res.redirect(`/castles/${castle._id}`);
})
);
// Edit form route
router.get("/:id/edit", isLoggedIn, verifyAuthor, wrapAsync(async (req, res) => {
  const castle = await Castle.findById(req.params.id);
  if (!castle) {
    req.flash('error', 'Seems like the castle is no longer there!');
    return res.redirect("/castles");
  }
  res.render("castles/edit", { castle });
})
);
// Update route
router.put("/:id", isLoggedIn, verifyAuthor, validateCastle, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const castle = await Castle.findByIdAndUpdate(id, { ...req.body.castle });
  req.flash('success', 'Successfully updated the castle.');
  res.redirect(`/castles/${castle._id}`);
})
);
// Delete route
router.delete("/:id", isLoggedIn, verifyAuthor, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Castle.findByIdAndDelete(id);
  req.flash('success', 'Successfully demolished the castle.');
  res.redirect("/castles");
})
);

// Show route
router.get("/:id", wrapAsync(async (req, res) => {
  const castle = await Castle.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
  if (!castle) {
    req.flash('error', 'Seems like the castle is no longer there!');
    return res.redirect("/castles");
  }
  res.render("castles/show", { castle });
})
);

module.exports = router;
