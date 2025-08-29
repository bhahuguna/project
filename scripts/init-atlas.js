const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

// Sample listings with coordinates for different locations
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
  },
  {
    title: "Luxury Beach Resort",
    description: "Enjoy luxury amenities and pristine beaches at this exclusive resort.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 3000,
    location: "Goa",
    country: "India",
    geometry: {
      type: 'Point',
      coordinates: [73.7442, 15.2993]
    }
  },
  {
    title: "Mountain Cabin Retreat",
    description: "Escape to the mountains in this cozy cabin surrounded by nature.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 800,
    location: "Manali",
    country: "India",
    geometry: {
      type: 'Point',
      coordinates: [77.1892, 32.2396]
    }
  }
];

async function initializeAtlasDB() {
  try {
    const dbUrl = process.env.ATLASDB_URL || process.env.DATABASE_URL;
    
    if (!dbUrl) {
      console.error("No database URL found. Please set ATLASDB_URL environment variable.");
      process.exit(1);
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to MongoDB Atlas successfully");

    // Check if data already exists
    const existingListings = await Listing.countDocuments();
    const existingUsers = await User.countDocuments();

    console.log(`Found ${existingListings} existing listings and ${existingUsers} existing users`);

    if (existingListings === 0) {
      console.log("Creating sample listings...");
      
      // Create a default user if none exists
      let defaultUser;
      if (existingUsers === 0) {
        console.log("Creating default user...");
        const newUser = new User({
          username: "admin",
          email: "admin@majorproject.com"
        });
        
        defaultUser = await User.register(newUser, "admin123");
        console.log("✅ Default user created (username: admin, password: admin123)");
      } else {
        defaultUser = await User.findOne();
        console.log("Using existing user:", defaultUser.username);
      }

      // Add owner to sample listings
      const listingsWithOwner = sampleListings.map(listing => ({
        ...listing,
        owner: defaultUser._id
      }));

      await Listing.insertMany(listingsWithOwner);
      console.log(`✅ Created ${listingsWithOwner.length} sample listings with maps coordinates`);
    } else {
      console.log("Sample data already exists. Skipping initialization.");
    }

    console.log("🎉 Database initialization complete!");
    console.log("Your app is ready with sample listings and maps!");
    
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
}

// Run initialization
initializeAtlasDB();
