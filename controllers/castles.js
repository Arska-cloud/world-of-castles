const Castle = require('../models/castle');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const castles = await Castle.find({});
    res.render('castles/index', { castles });
};

module.exports.renderNewForm = (req, res) => {
    res.render('castles/new');
};

module.exports.createCastle = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({ query: req.body.castle.location, limit: 1 }).send()
    const castle = new Castle(req.body.castle);
    castle.geometry = geoData.body.features[0].geometry;
    castle.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    castle.author = req.user._id;
    await castle.save();
    req.flash('success', 'Successfully built a castle.');
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
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    castle.images.push(...imgs);
    await castle.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await castle.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully upgraded the castle.');
    res.redirect(`/castles/${castle._id}`);
};



module.exports.deleteCastle = async (req, res) => {
    const { id } = req.params;
    await Castle.findByIdAndDelete(id);
    req.flash('success', 'Successfully demolished the castle.');
    res.redirect("/castles");
};