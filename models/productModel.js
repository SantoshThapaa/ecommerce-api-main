const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    countInStock: {
        type: Number,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    productRating: {
        type: Number,
        default: 0,
        max: 5
    },
    category: {
        type: ObjectId,
        required: true,
        ref:'Category'
    }
},
{
    timestamps: true
})

module.exports=mongoose.model('Product',productSchema)