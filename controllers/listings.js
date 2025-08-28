const Listing=require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const geocodingService = require("../utils/geocoding");


module.exports.index=async (req,res)=>{
const allListings=await Listing.find({});
res.render("listings/index.ejs",{allListings});
};



module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}


module.exports.showListing=async (req,res)=>{
    let {id} = req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    }}).populate("owner");
     if(!listing){
        req.flash("error","listing you requested for does not exist");
       return res.redirect("/listings");
    }
    // console.log(listing)
    res.render("listings/show.ejs",{listing});
}


module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;

        const newListing=new Listing(req.body.listing);
        newListing.owner=req.user._id;
        newListing.image={url,filename};

        // Set default coordinates (geocoding disabled due to API issues)
        // You can enable geocoding later by uncommenting the code below
        newListing.geometry = {
            type: 'Point',
            coordinates: [77.1025, 28.7041] // Default to Delhi, India
        };

        /* Geocoding code (disabled):
        if (newListing.location) {
            const fullAddress = `${newListing.location}, ${newListing.country}`;
            const coordinates = await geocodingService.getCoordinates(fullAddress);
            newListing.geometry = {
                type: 'Point',
                coordinates: [coordinates.longitude, coordinates.latitude]
            };
        }
        */

        await newListing.save();
        req.flash("success","new listing Created");
       res.redirect("/listings");
    //    next(err);
}



module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
      if(!listing){
        req.flash("error","listing you requested for does not exist");
        return res.redirect("/listings");
    }
   let orginalImage=listing.image.url;
   orginalImage=orginalImage.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing,orginalImage})
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});

   // Set default coordinates (geocoding disabled due to API issues)
   // Update geometry only if it doesn't exist
   if (!listing.geometry || !listing.geometry.coordinates) {
       listing.geometry = {
           type: 'Point',
           coordinates: [77.1025, 28.7041] // Default to Delhi, India
       };
   }

   /* Geocoding code (disabled):
   if (req.body.listing.location || req.body.listing.country) {
       const fullAddress = `${req.body.listing.location || listing.location}, ${req.body.listing.country || listing.country}`;
       const coordinates = await geocodingService.getCoordinates(fullAddress);
       listing.geometry = {
           type: 'Point',
           coordinates: [coordinates.longitude, coordinates.latitude]
       };
   }
   */

   if(typeof req.file != "undefined"){
 let url=req.file.path;
    let filename=req.file.filename;
     listing.image={url,filename};
   }
   await listing.save();
        req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
        req.flash("success","listng Deleted");
    res.redirect("/listings")
}

