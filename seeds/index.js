const mongoose = require('mongoose')
const Presentation = require('../models/presentation')

 

mongoose.connect('mongodb://localhost:27017/omdia',{
})

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})


const seedDB = async () => {
    await Presentation.deleteMany({})
        const present = new Presentation({ 
            title: "Febuary Omdia Review",
            tags:["OpenRAN","vRAN","Fiber","CRAN","Microwave","AI","Automation","Renewable Energy","Carbon Neutrality", "Energy Efficiency","Carbon Credits"],
            code: "feb25"
        })
        await present.save()
}

seedDB().then(()=>{
    mongoose.connection.close()
})