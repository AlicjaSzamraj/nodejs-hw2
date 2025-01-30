const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");
const { updateAvatar } = require("../../controllers/users");
const router = express.Router();

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
