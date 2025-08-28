const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

// Sample data for deployment
const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description: "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
    geometry: {
      type: 'Point',
      coordinates: [-118.6919, 34.0259]
    }
  },
  {
    title: "Modern Loft in Downtown",
    description: "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "New York City",
    country: "United States",
    geometry: {
      type: 'Point',
      coordinates: [-74.0060, 40.7128]
    }
  },
  {
    title: "Historic Villa in Tuscany",
    description: "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 2500,
    location: "Florence",
    country: "Italy",
    geometry: {
      type: 'Point',
      coordinates: [11.2558, 43.7696]
    }
  }
];

async function initializeDeployment() {
  try {
    console.log("Initializing deployment data...");
    
    // Check if data already exists
    const existingListings = await Listing.countDocuments();
    
    if (existingListings === 0) {
      console.log("No existing data found. Creating sample listings...");
      
      // Create a default user for the listings
      const defaultUser = new User({
        username: "admin",
        email: "admin@example.com"
      });
      
      try {
        await User.register(defaultUser, "password123");
        console.log("Default user created");
      } catch (error) {
        console.log("Default user might already exist");
      }
      
      // Add owner to sample listings
      const user = await User.findOne({ username: "admin" });
      const listingsWithOwner = sampleListings.map(listing => ({
        ...listing,
        owner: user._id
      }));
      
      await Listing.insertMany(listingsWithOwner);
      console.log(`Created ${listingsWithOwner.length} sample listings`);
    } else {
      console.log(`Found ${existingListings} existing listings. Skipping initialization.`);
    }
    
    console.log("Deployment initialization complete!");
    
  } catch (error) {
    console.error("Error during deployment initialization:", error);
  }
}

// Only run if this script is called directly
if (require.main === module) {
  const dbUrl = process.env.ATLASDB_URL || process.env.DATABASE_URL || 'mongodb://localhost:27017/majorproject';
  
  mongoose.connect(dbUrl)
    .then(() => {
      console.log("Connected to database");
      return initializeDeployment();
    })
    .then(() => {
      console.log("Closing database connection");
      return mongoose.connection.close();
    })
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("Deployment initialization failed:", error);
      process.exit(1);
    });
}

module.exports = initializeDeployment;
