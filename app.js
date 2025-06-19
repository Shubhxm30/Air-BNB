const express = require("express");
const app = express();
const path = require("path");
const mongoose = require ("mongoose");

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


app.get("/",(req,res) => {
    res.send("Route is working");
})

app.listen(8080,()=>{
    console.log("listening on port 8080");
})