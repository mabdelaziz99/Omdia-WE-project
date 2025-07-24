const { number } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleSchema = new Schema ({
    title: String,
    code: {
        type: String,
        lowercase: true
    },
    tags: [{
        type: String,
        enum: ['RAN', 'vRAN', 'OpenRAN','AI-RAN', 'AI', '5G', '6G','Automation', 'Market Share', 'Cloud', 'Customer Experience', 'Digital Transformation', 'Fiber', 'cRAN','Microwave', 'Energy Efficiency', 'Recycling & Reuse', 'Green Energy', 'Digital Inclusion', 'Conservation', 'Green Bonds', 'Carbon Credits']
    }],
    p1: String,
    domains: [{
        type: String,
        enum: ['Wireless Access', 'Fixed Access', 'Transmission', 'Core', 'Sustainability']
    }],
    img1URL: [String],
    p2: String,
    img2URL: [String],
})

module.exports = mongoose.model('Article', ArticleSchema)