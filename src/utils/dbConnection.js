const mongoose = require("mongoose")
mongoose.set("strictQuery",true)



const db = ()=>{
    mongoose.connect("mongodb://localhost:27017/nodeSecurity").then(()=>{
        console.log("MongoDb connected successfull!")
    }).catch(()=>{
        console.log("Failed to connect MongoDb")
    })
}

module.exports= db;