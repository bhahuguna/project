const user=require("../models/user")

module.exports.home=(req,res)=>{
    res.render("home.ejs");
}

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs")
}


module.exports.signUp=async(req,res)=>{
    try{
let{username,email,password}=req.body;
const newuser=new user({email,username});
const registereduser=await user.register(newuser,password);
// ff
req.login(registereduser,(err)=>{
if(err){
    return next(err);
}
req.flash("sucess","welcome to website");
res.redirect("/listings");
})
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    }

module.exports.loginForm=(req,res)=>{
        res.render("users/login.ejs")
    };



module.exports.login=async(req,res)=>{
req.flash("success","you logined successfully")
// console.log(res.locals.redirectUrl)
let redirectUrl=res.locals.redirectUrl||"/listings";
res.redirect(redirectUrl);
}


module.exports.logout=(req,res)=>{
    req.logout((err)=>{
if(err){
   return next(err);
}
req.flash("success","you are logged out succesfully");
res.redirect("/listings")
    }
    )
}