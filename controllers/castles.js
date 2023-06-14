const Castle = require('../models/castle');

module.exports.index = async (req, res) => {
    const castles = await Castle.find({});
    res.render('castles/index', { castles });
};

module.exports.renderNewForm = (req, res) => {
    res.render('castles/new');
};

module.exports.createCastle = async (req, res) => {
    const castle = new Castle(req.body.castle);
    castle.author = req.user._id;
    await castle.save();
    req.flash('success', 'Successfully built a castle.');
    res.redirect(`/castles/${castle._id}`);
};

module.exports.renderEditForm = async (req, res) => {
    const castle = await Castle.findById(req.params.id);
    if (!castle) {
        req.flash('error', 'Seems like the castle is no longer there!');
        return res.redirect("/castles");
    }
    res.render("castles/edit", { castle });
};

module.exports.updateCastle = async (req, res) => {
    const { id } = req.params;
    const castle = await Castle.findByIdAndUpdate(id, { ...req.body.castle });
    req.flash('success', 'Successfully upgraded the castle.');
    res.redirect(`/castles/${castle._id}`);
};

module.exports.showCastle = async (req, res) => {
    const castle = await Castle.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!castle) {
        req.flash('error', 'Seems like the castle is no longer there!');
        return res.redirect("/castles");
    }
    res.render("castles/show", { castle });
};

module.exports.deleteCastle = async (req, res) => {
    const { id } = req.params;
    await Castle.findByIdAndDelete(id);
    req.flash('success', 'Successfully demolished the castle.');
    res.redirect("/castles");
};