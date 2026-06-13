const mongoose = require("mongoose");
const axios = require("axios");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("connected to db");
}

main()
    .then(() => initDB())
    .catch(console.error);

const initDB = async () => {
    await Listing.deleteMany({});

    const listingsWithGeometry = [];

    for (let obj of initData.data) {
        try {
            const response = await axios.get(
                "https://nominatim.openstreetmap.org/search",
                {
                    params: {
                        q: `${obj.location}, ${obj.country}`,
                        format: "json",
                        limit: 1,
                    },
                    headers: {
                        "User-Agent": "WanderLust/1.0"
                    }
                }
            );

            if (response.data.length > 0) {
                const place = response.data[0];

                obj.geometry = {
                    type: "Point",
                    coordinates: [
                        parseFloat(place.lon),
                        parseFloat(place.lat)
                    ]
                };
            } else {
                // console.log(`Location not found: ${obj.location}`);

                // fallback coordinates
                obj.geometry = {
                    type: "Point",
                    coordinates: [0, 0]
                };
            }

            obj.owner = "6a1c150dee98c5614d7f0f05";
            listingsWithGeometry.push(obj);

            // console.log(`✓ ${obj.location}`);
        } catch (err) {
            console.error(`Error for ${obj.location}:`, err.message);
        }
    }

    await Listing.insertMany(listingsWithGeometry);
    console.log("Data initialized successfully");
};


// initDB();