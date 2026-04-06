const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const emailToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      emailToken,
    });

    await newUser.save();

    const verifyUrl = `http://localhost:5173/verify-email/${emailToken}`;

    await sendEmail(
      email,
      "Email Doğrulama",
      `Hesabını doğrulamak için linke tıkla:\n${verifyUrl}`,
    );

    res.status(201).json({
      message: "Kayıt başarılı. Email gönderildi.",
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ emailToken: req.params.token });

    if (!user) {
      return res.status(400).json("Geçersiz token");
    }

    user.isVerified = true;
    user.emailToken = null;

    await user.save();

    res.json("Email doğrulandı 🎉");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found");

    if (!user.isVerified) {
      return res.status(400).json("Email doğrulanmamış");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Wrong password");

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: _, ...userData } = user._doc;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .status(200)
      .json({
        message: "Login successful",
        token,
        user: userData,
      });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found");

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 1000 * 60 * 15;

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    await sendEmail(
      email,
      "Şifre Sıfırlama",
      `Şifreni sıfırlamak için linke tıkla:\n${resetUrl}`,
    );

    res.json("Reset mail gönderildi 📧");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json("Token geçersiz veya süresi dolmuş");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.json("Şifre başarıyla güncellendi 🔐");
  } catch (err) {
    res.status(500).json(err.message);
  }
};
