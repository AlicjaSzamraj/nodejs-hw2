const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");
const { updateAvatar, verifyEmail } = require("../../controllers/users");
const { sendVerificationEmail } = require("../../controllers/auth");
const User = require("../../models/user");
const router = express.Router();

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

router.get("/verify/:verificationToken", verifyEmail);

router.post("/verify", async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "missing required field email" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.verify) {
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });
  }

  sendVerificationEmail(email, user.verificationToken);

  res.status(200).json({ message: "Verification email sent" });
});

module.exports = router;
