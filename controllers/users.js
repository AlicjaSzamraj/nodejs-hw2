const fs = require("fs").promises;
const path = require("path");
const Jimp = require("jimp");
const User = require("../models/user");

const avatarsDir = path.join(__dirname, "../public/avatars");

const updateAvatar = async (req, res, next) => {
  try {
    const { path: tempUpload, originalname } = req.file;
    const { _id: id } = req.user;
    const filename = `${id}-${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    const image = await Jimp.read(tempUpload);
    await image.resize(250, 250).writeAsync(resultUpload);

    await fs.unlink(tempUpload);
    const avatarURL = `/avatars/${filename}`;
    await User.findByIdAndUpdate(req.user._id, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    console.log("Received verificationToken:", verificationToken);

    const user = await User.findOne({ verificationToken });
    console.log("Found user:", user);

    if (!user) {
      console.log("User not found with token:", verificationToken);
      return res.status(404).json({ message: "User not found" });
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error("Error in verifyEmail function:", error);
    next(error);
  }
};

module.exports = { updateAvatar, verifyEmail };
