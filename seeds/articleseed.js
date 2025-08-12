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
            title: "Open RAN Vs vRAN",
            code: "feb25",
            domains: 'Wireless Access',
            tags:["RAN","vRAN","OpenRAN"],
            p1: "Open vRAN is expected to grow in 2024 as its adoption by brownfield operators starts contributing more significant revenue for vendors and North America’s spending starts growing again after a particularly slow 2023. Open vRAN is expected to represent approximately 7.8% of the total RAN market for the full year 2024.",
            img1URL:["/imgs/Legacy-RAN-Vs.-vRAN.png","/imgs/vRAN-Architecture.png"],
            summary: "This report covers the rising adoption of open vRAN, expected to reach 7.8% of the RAN market in 2024 and grow to 18.7% by 2028, driven by established operators and renewed North American investment.",
            p2:"Based on guidance from operators, Omdia expects a more significant inflection and mainstream adoption of open vRAN from 2025. The long-term forecast is within the same range as before, with open vRAN now expected to represent 18.7% of the total RAN market by 2028, compared with 18.9% in the previous edition of the forecast."
        })
        await present.save()
}

seedDB().then(()=>{
    mongoose.connection.close()
})