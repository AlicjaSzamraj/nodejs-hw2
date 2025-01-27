const express = require("express");
const { register, login, logout, current } = require("../../controllers/auth");
const authenticate = require("../../middlewares/authenticate");
const router = express.Router();

router.post("/signup", register);

router.post("/login", login);

router.get("/logout", authenticate, logout);

router.get("/current", authenticate, current);

module.exports = router;
