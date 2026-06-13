const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
    .route("/")
    .get(wrapAsync(listingController.index))//index
    .post(isLoggedIn,
        upload.single('listing[image][url]'),
        validateListing,
        wrapAsync(listingController.createListing));//create

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


router.get("/search", listingController.searchListings);

router
    .route("/:id")
    .get(wrapAsync(listingController.renderShowForm))//show route
    .put(isLoggedIn, isOwner, upload.single('listing[image][url]'), validateListing, wrapAsync(listingController.updateListing))//update route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));//delete route

module.exports = router;