const mongoose = require('mongoose');
const data = require("./data.js");
const listing = require ("../models/listing.js");

const MongoURL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(()=>{
    console.log("connection Successful to DataBase");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MongoURL);
}

const initDB = async () => {
    await listing.deleteMany({});
    await listing.insertMany(data.data);
    console.log("data was initialized"); 
}

initDB();