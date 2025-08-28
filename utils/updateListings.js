const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const geocodingService = require("./geocoding.js");

// Connect to database
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/majorproject');
}

async function updateListingsWithCoordinates() {
    try {
        console.log("Connecting to database...");
        await main();
        console.log("Connected to database");

        // Find all listings without geometry field or with default coordinates
        const listingsToUpdate = await Listing.find({
            $or: [
                { geometry: { $exists: false } },
                { "geometry.coordinates": [0, 0] },
                { geometry: null }
            ]
        });

        console.log(`Found ${listingsToUpdate.length} listings to update`);

        for (let i = 0; i < listingsToUpdate.length; i++) {
            const listing = listingsToUpdate[i];
            console.log(`Updating listing ${i + 1}/${listingsToUpdate.length}: ${listing.title}`);

            if (listing.location && listing.country) {
                const fullAddress = `${listing.location}, ${listing.country}`;
                console.log(`Geocoding: ${fullAddress}`);
                
                const coordinates = await geocodingService.getCoordinates(fullAddress);
                
                // Update the listing with coordinates
                await Listing.findByIdAndUpdate(listing._id, {
                    geometry: {
                        type: 'Point',
                        coordinates: [coordinates.longitude, coordinates.latitude]
                    }
                });

                console.log(`Updated with coordinates: [${coordinates.longitude}, ${coordinates.latitude}]`);
                
                // Add a small delay to avoid overwhelming the geocoding service
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                // Set default coordinates if location/country is missing
                await Listing.findByIdAndUpdate(listing._id, {
                    geometry: {
                        type: 'Point',
                        coordinates: [0, 0]
                    }
                });
                console.log(`Set default coordinates for listing without location data`);
            }
        }

        console.log("All listings updated successfully!");
        process.exit(0);

    } catch (error) {
        console.error("Error updating listings:", error);
        process.exit(1);
    }
}

updateListingsWithCoordinates();
