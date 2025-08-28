const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

// Connect to database
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/majorproject');
}

async function fixListingsWithSampleCoordinates() {
    try {
        console.log("Connecting to database...");
        await main();
        console.log("Connected to database");

        // Find all listings without proper geometry field
        const listingsToUpdate = await Listing.find({
            $or: [
                { geometry: { $exists: false } },
                { "geometry.coordinates": [0, 0] },
                { geometry: null }
            ]
        });

        console.log(`Found ${listingsToUpdate.length} listings to update`);

        // Sample coordinates for different locations
        const sampleCoordinates = [
            [78.8718, 13.6288], // Tirupati, India
            [77.1025, 28.7041], // Delhi, India
            [72.8777, 19.0760], // Mumbai, India
            [77.5946, 12.9716], // Bangalore, India
            [80.2707, 13.0827], // Chennai, India
        ];

        for (let i = 0; i < listingsToUpdate.length; i++) {
            const listing = listingsToUpdate[i];
            console.log(`Updating listing ${i + 1}/${listingsToUpdate.length}: ${listing.title}`);

            // Use sample coordinates based on index
            const coords = sampleCoordinates[i % sampleCoordinates.length];
            
            // Update the listing with coordinates
            await Listing.findByIdAndUpdate(listing._id, {
                geometry: {
                    type: 'Point',
                    coordinates: coords
                }
            });

            console.log(`Updated with coordinates: [${coords[0]}, ${coords[1]}]`);
        }

        console.log("All listings updated successfully!");
        process.exit(0);

    } catch (error) {
        console.error("Error updating listings:", error);
        process.exit(1);
    }
}

fixListingsWithSampleCoordinates();
