const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");


main()
.then(()=>{
console.log("connected to db");
})
.catch(err=>{
    console.log(err);
})

async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/majorproject');
}

const initdb=async()=>{
    await Listing.deleteMany({});

    // Add sample coordinates for each listing
    const sampleCoordinates = [
        [-118.6919, 34.0259], // Malibu
        [-74.0060, 40.7128],  // New York City
        [-106.8175, 39.1911], // Aspen
        [11.2558, 43.7696],   // Florence
        [2.3522, 48.8566],    // Paris
        [-0.1276, 51.5074],   // London
        [139.6503, 35.6762],  // Tokyo
        [18.0686, 59.3293],   // Stockholm
        [12.4964, 41.9028],   // Rome
        [-3.7038, 40.4168],   // Madrid
        [2.1734, 41.3851],    // Barcelona
        [4.9041, 52.3676],    // Amsterdam
        [13.4050, 52.5200],   // Berlin
        [16.3738, 48.2082],   // Vienna
        [21.0122, 52.2297],   // Warsaw
        [24.7536, 59.4370],   // Tallinn
        [25.2797, 54.6872],   // Vilnius
        [24.1052, 56.9496],   // Riga
        [10.7522, 59.9139],   // Oslo
        [12.5683, 55.6761],   // Copenhagen
    ];

    initData.data = initData.data.map((obj, index) => ({
        ...obj,
        owner: "683ea5014ed63d12508c26d3",
        geometry: {
            type: 'Point',
            coordinates: sampleCoordinates[index % sampleCoordinates.length]
        }
    }));

    await Listing.insertMany(initData.data);
    console.log("data was initialized with coordinates");
}

initdb();