const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PresentationSchema = new Schema ({
    title: String,
    code: String,
    tags: [String]
})

module.exports = mongoose.model('Presentation', PresentationSchema)