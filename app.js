const express = require("express");
const app = express();
const path = require("path");
const mongoose = require ("mongoose");
const MongoURL = 'mongodb://127.0.0.1:27017/wanderlust';
const listing = require ('./models/listing.js');
const data = require('./init/data.js');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync.js');
const expressError = require('./utils/expressError.js');
const {listingSchema} = require('./schema.js');

app.set("views", path. join (__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

main().then(()=>{
    console.log("connection Successful to DataBase");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MongoURL);
}

app.get("/",(req,res) => {
    res.send("Route is working");
})

const validatelisting = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body.listing);
    
    if(error){
        throw new expressError(400, error);
    }else{
        next();
    }
}

// Index Route :
app.get("/lists",wrapAsync(async(req,res,next)=>{
    const alllistings = await listing.find({});
    res.render("listings/index.ejs", { alllistings } );
}));

//NEW Route :
app.get("/lists/new",(req,res,next)=>{
    res.render("./listings/new.ejs");
});

//Show Route:
app.get("/lists/:id",wrapAsync(async(req,res, next)=>{
    let {id} = req.params;
    const listings = await listing.findById(id);
    // console.log(listings);
    res.render("./listings/show.ejs", { listings } );
}));

// Create Route :
app.post("/lists",validatelisting,wrapAsync(async(req,res, next)=>{

    const newListing = new listing(req.body.listing);
    await newListing.save();
    return res.redirect("/lists");
}));

// app.post("/lists", wrapAsync(async (req, res, next) => {
//     if (!req.body.listing) {
//         throw new expressError(400, "Listing data is missing");
//     }

//     // ✅ Correct Joi validation usage
//     const { error, value } = listingSchema.validate(req.body.listing);
//     if (error) {
//         throw new expressError(400, error.message);  // Avoid accessing undefined.error
//     }

//     const newListing = new listing(value);
//     await newListing.save();

//     // ✅ Either use res.redirect (browser) OR res.json (API tool)
//     if (req.headers.accept && req.headers.accept.includes("application/json")) {
//         return res.status(201).json({ message: "Listing created", listing: newListing });
//     }

//     return res.redirect("/lists");

// }));



//Edit Route :
app.get("/lists/:id/edit",wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    const listings = await listing.findById(id);
    res.render("./listings/edit.ejs", {listings} );
}));

//Update Route :
app.put("/lists/:id",validatelisting,wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/lists/${id}`);
}));

//Delete Route :
app.delete("/lists/:id",wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    let deletedList = await listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/lists");
}));

// middleware function for async errors.

app.all("/*splat",(req, res, next)=>{
    next(new expressError(404,"404 : PAGE NOT FOUND!"));
})

app.use((err,req,res,next)=>{
    console.log("this errors :",err);
    const {status = 500, message = "Something Went Wrong"} = err;
    res.status(status).render("error.ejs", {err});
})
// app.use((err, req, res, next) => {
//     const { name, message } = err;
    
//     // Mongoose Validation Error
//     if (name === 'ValidationError') {
//         const messages = Object.values(err.errors).map(val => val.message);
//         return res.status(400).render('error', { 
//             title: 'Validation Error',
//             message: 'Please fix the following errors:',
//             errors: messages 
//         });
//     }
    
//     // Other Errors
//     res.status(500).render('error', {
//         title: 'Error',
//         message: message || 'Something went wrong!',
//         errors: []
//     });
// });

// // 404 Handler
// app.use((req, res) => {
//     res.status(404).render('error', {
//         title: 'Not Found',
//         message: 'The page you requested does not exist',
//         errors: []
//     });
// });

app.listen(8080,()=>{
    console.log("listening on port 8080");
})