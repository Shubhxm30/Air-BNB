const express = require("express");
const app = express();
const path = require("path");
const mongoose = require ("mongoose");
const MongoURL = 'mongodb://127.0.0.1:27017/wanderlust';
const listing = require ('./models/listing.js');
const data = require('./init/data.js');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");

app.set("views", path. join (__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "public")));

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

// Index Route :
app.get("/lists",async(req,res)=>{
    const alllistings = await listing.find({});
    res.render("listings/index.ejs", { alllistings } );
})

//NEW Route :
app.get("/lists/new",(req,res)=>{
    res.render("./listings/new.ejs");
})

//Show Route:
app.get("/lists/:id",async(req,res)=>{
    let {id} = req.params;
    const listings = await listing.findById(id);
    // console.log(listings);
    res.render("./listings/show.ejs", { listings } );
})

//Create Route :
app.post("/lists",async(req,res)=>{
    // let {title, description, image, price, location, country} = req.body;
    // let listing = req.body.listing;
    // console.log(listing);

    const newListing = new listing(req.body.listing);
    await newListing.save()
    res.redirect("/lists");
})

//Edit Route :
app.get("/lists/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const listings = await listing.findById(id);
    res.render("./listings/edit.ejs", {listings} );
})

//Update Route :
app.put("/lists/:id",async(req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/lists/${id}`);
})

//Delete Route :
app.delete("/lists/:id",async(req,res)=>{
    let {id} = req.params;
    let deletedList = await listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/lists");
})

app.listen(8080,()=>{
    console.log("listening on port 8080");
})