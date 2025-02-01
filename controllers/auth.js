const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Joi = require("joi");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = uuidv4();
    console.log("Generated verificationToken:", verificationToken);

    const newUser = new User({
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken,
    });
    await newUser.save();
    console.log("Saved newUser with verificationToken:", newUser);

    sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.verify) {
      return res
        .status(401)
        .json({ message: "Email or password is wrong or email not verified" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    user.token = null;
    await user.save();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const sendVerificationEmail = (email, token) => {
  const msg = {
    to: email,
    from: "alicja.szamraj@gmail.com",
    subject: "Email Verification",
    text: `Please verify your email by clicking the following link: http://localhost:3000/api/users/verify/${token}`,
    html: `<strong>Please verify your email by clicking the following link: <a href="http://localhost:3000/api/users/verify/${token}">Verify Email</a></strong>`,
  };

  sgMail.send(msg).then(
    () => console.log("Email sent"),
    (error) => console.error(error)
  );
};

module.exports = { register, login, logout, current };
