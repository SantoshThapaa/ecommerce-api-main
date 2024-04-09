const mongoose = require('mongoose')

const categoryScheme = new mongoose.Schema({
    category_name:{
        type: String,
        required: true,
        trim: true,
        // unique: true
    }
},{
    timestamps: true // createdAt and updatedAt
})

module.exports = mongoose.model('Category',categoryScheme)