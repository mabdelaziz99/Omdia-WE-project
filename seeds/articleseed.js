const mongoose = require('mongoose')
const Article = require('../models/article')

 

mongoose.connect('mongodb://localhost:27017/omdia',{
})

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})


const seedDB = async () => {
    // await Article.deleteMany({})
        const present = new Article({ 
            title: "Multicore Fiber (MCF) for Terrestrial Networks",
            p1: "The first commercial deployment of multicore fiber (MCF) is the Taiwan- Philippines-US (TPU) submarine cable. In September 2023, Google partnered with NEC to deploy two-core MCF in a cable project with Chunghwa Telecom, Innove, and AT&T. While research suggests MCF could enhance transmission in terrestrial networks, further business case analysis is required.",
            tags:["Fiber"],
            code: "feb25",
            domains: 'Transmission',
            img1URL:["/imgs/Multicore-Fiber1.png"]
        })
        await present.save()
}

seedDB().then(()=>{
    mongoose.connection.close()
})