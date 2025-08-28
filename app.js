
if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}  
// console.log(process.env.SECRET);



const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate")
const session=require("express-session")
const MongoStore = require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const ExpressError = require("./utils/ExpressError");




const userRouter=require("./routes/user.js");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");

// Database URL with fallbacks for different environments
const dburl = process.env.DATABASE_URL ||
              process.env.ATLASDB_URL ||
              process.env.MONGODB_URI ||
              "mongodb://127.0.0.1:27017/majorproject";

console.log("Attempting to connect to database...");

main()
.then(()=>{
console.log("connected to db successfully");
})
.catch(err=>{
    console.log("Database connection error:", err.message);
    console.log("Please check your database configuration");
    // Don't exit the process, let it continue for debugging
})

async function main(){
   await mongoose.connect(dburl, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
   });
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodoverride("_method"))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
            secret:process.env.SECRET || "fallback-secret-key",
    },
    touchAfter:24*3600,

})

store.on("error",()=>{
    console.log("Error in Mongo Store",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET || "fallback-secret-key",
    resave:false,
    saveUninitialized:true,
    cookie :{
  expires:Date.now() +7*24*60*60*1000,
  maxAge:7*24*60*60*1000,
  httpOnly:true,
    }
}


app.use(session(sessionOptions));
app.use(flash());

// app.use("/",(req,res)=>{
//     res.send("hi i am route");
// })
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));



passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
     res.locals.error=req.flash("error");
     res.locals.currUser=req.user;
    next();
})


// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//    let registeredUser=await User.register(fakeUser,"helloworld");
//    res.send(registeredUser)
// })




app.use("/listings",listingsRouter);

app.use("/listings/:id/reviews",reviewsRouter)

app.use("/",userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})



app.use((err,req,res,next)=> {
    let{statusCode=500,message="something went wrong!"}=err;
    res.status(statusCode).render("Error.ejs",{message});    
});



const port = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log(`server is listening to port ${port}`);
})