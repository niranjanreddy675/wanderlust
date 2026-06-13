const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


router
    .route("/signup")
    .get(userController.signUpUser)
    .post(wrapAsync(userController.postSignup));



router
    .route("/login")
    .get(userController.loginUser)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        userController.postLogin
    );

router.get("/logout", userController.logoutUser);


module.exports = router;