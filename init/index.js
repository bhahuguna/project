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
   await mongoose.connect('mongodb://127.0.0.1:27017/test3');
}

const initdb=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"683ea5014ed63d12508c26d3"}))
    await Listing.insertMany(initData.data);
    console.log("data was initilazed");
}

initdb();