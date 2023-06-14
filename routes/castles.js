const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Castle = require("../models/castle");
const { castleSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware")
const ExpressError = require("../utils/ExpressError");
const Joi = require("joi");

// Validation middleware
const validateCastle = (req, res, next) => {
  const { error } = castleSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Routes
router.get("/", wrapAsync(async (req, res) => {
  const castles = await Castle.find({});
  res.render("castles/index", { castles });
})
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("castles/new");
});

// Create, Edit, Update and delete routes for castles
router.post("/", isLoggedIn, validateCastle, wrapAsync(async (req, res) => {
  const castle = new Castle(req.body.castle);
  await castle.save();
  req.flash('success', 'Successfully built a castle.');
  res.redirect(`/castles/${castle._id}`);
})
);

router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
  const castle = await Castle.findById(req.params.id);
  if (!castle) {
    req.flash('error', 'Seems like the castle is no longer there!');
    return res.redirect("/castles");
  }
  res.render("castles/edit", { castle });
})
);

router.put("/:id", isLoggedIn, validateCastle, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const castle = await Castle.findByIdAndUpdate(id, { ...req.body.castle });
  req.flash('success', 'Successfully updated the castle.');
  res.redirect(`/castles/${castle._id}`);
})
);

router.delete("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Castle.findByIdAndDelete(id);
  req.flash('success', 'Successfully demolished the castle.');
  res.redirect("/castles");
})
);

// Show route
router.get("/:id", wrapAsync(async (req, res) => {
  const castle = await Castle.findById(req.params.id).populate("reviews");
  if (!castle) {
    req.flash('error', 'Seems like the castle is no longer there!');
    return res.redirect("/castles");
  }
  res.render("castles/show", { castle });
})
);

module.exports = router;
