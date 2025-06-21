const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true 
    },
    description : String,
    image : {
        type : String,
        default : "file:///Users/shubhamvani/Downloads/zhen-yao-6e4P19X8DZs-unsplash.jpg",
        set : (v)=> v === "" ? "file:///Users/shubhamvani/Downloads/zhen-yao-6e4P19X8DZs-unsplash.jpg" : v,
    },
    price : Number,
    location : String,
    country : String,
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;