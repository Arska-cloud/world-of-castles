const JWT = require("jsonwebtoken");
const User = require("../models/user");
const Token = require("../models/token");
const sendEmail = require("../utils/emails/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

module.exports.signup = async (data) => {
    let user = await User.findOne({ email: data.email });
    if (user) {
        throw new Error("User or email already exists", 422);
    }
    user = new User(data);
    const token = JWT.sign({ id: user._id }, process.env.SECRET);
    await user.save();

    return (data = {
        userId: user._id,
        email: user.email,
        name: user.name,
        token: token,
    });
};

module.exports.requestPasswordReset = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email could not be found");

    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(12));

    await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
    }).save();

    const link = `https://localhost:3000/reset/passwordReset?token=${resetToken}&id=${user._id}`;

    sendEmail(
        user.email,
        "Password Reset Request",
        {
            name: user.name,
            link: link,
        },
        "./templates/resetRequest.ejs"
    );
    return { link };
};

module.exports.resetPassword = async (userId, token, password) => {
    let passwordResetToken = await Token.findOne({ userId });

    if (!passwordResetToken) {
        throw new Error("Invalid or expired password reset token");
    }

    console.log(passwordResetToken.token, token);

    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValid) {
        throw new Error("Invalid or expired password reset token");
    }

    const hash = await bcrypt.hash(password, Number(12));

    await User.updateOne(
        { _id: userId },
        { $set: { password: hash } },
        { new: true }
    );

    const user = await User.findById({ _id: userId });

    sendEmail(
        user.email,
        "Password Reset Successfully",
        {
            name: user.name,
        },
        "./templates/resetPassword.ejs"
    );

    await passwordResetToken.deleteOne();

    return { message: "Password reset was successful" };
};