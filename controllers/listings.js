const Listing = require("../models/listing");
const axios = require("axios");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.searchListings = async (req, res) => {
    const { location } = req.query;

    const listings = await Listing.find({
        $or: [
            { location: { $regex: location, $options: "i" } },
            { country: { $regex: location, $options: "i" } },
            { title: { $regex: location, $options: "i" } }
        ]
    });

    res.render("listings/index.ejs", {
        allListings: listings
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.renderShowForm = async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate:{path:"author"},
    }).populate("owner");

    if(!listing){
        req.flash("error","listing you requested does not exist");
        return res.redirect("/listings")
    }
    // console.log(listing);
    res.render("./listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res,next) => {

    let response;
    try {
        response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
                params: {
                    q: req.body.listing.location,
                    format: "json",
                    limit: 1,
                },
                headers: {
                    "User-Agent": "WanderLust/1.0"
                }
            }
        );

        // console.log(response.data);

    } catch (err) {
        // console.log(err.response?.status);
        // console.log(err.response?.data);
        throw err;
    }

    // console.log(response.data);
    const place = response.data[0];

    const geometry = {
        type: "Point",
        coordinates: [
            parseFloat(place.lon),
            parseFloat(place.lat),
        ],
    };

    
    // console.log(geometry);
    // return res.send("done!");
  
    

    let url = req.file.path;
    let filename = req.file.filename;
   
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    console.log("GEOMETRY =", geometry);
    newListing.geometry = geometry;
    let savedListing = await newListing.save();
    console.log(savedListing.geometry);
    req.flash("success","New listing created");
    res.redirect("/listings");
    // let {title,description,image,price,country,location} = req.body;
    //    let listing = req.body;
    //    console.log(listing);
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing you requested does not exist");
        return res.redirect("/listings")
    }

    let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {

   
    let { id } = req.params;
    
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }

    req.flash("success", "listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
};