const Product = require('../models/productModel')

// to post product
exports.postProduct = async (req, res) => {
    let product = new Product({
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        countInStock: req.body.countInStock,
        productDescription: req.body.productDescription,
        productImage: req.file.path,
        category: req.body.category
    })
    product = await product.save()
    if (!product) {
        return res.status(400).json({ error: "something went wrong" })
    }
    res.send(product)
}

// to show all product
exports.showProduct = async (req, res) => {
    const product = await Product.find()
        .populate('category', 'category_name')
    if (!product) {
        return res.status(400).json({ error: "something went wrong" })
    }
    res.send(product)
}

// to show one product
exports.productDetails = async (req, res) => {
    const product = await Product.findById(req.params.pid)
        .populate('category')
    if (!product) {
        return res.status(400).json({ error: "something went wrong" })
    }
    res.send(product)
}

// to delete product
exports.deleteProduct = (req, res) => {
    Product.findByIdAndDelete(req.params.pid)
        .then(product => {
            if (!product) {
                // confirm(`Are you sure you want to delete ${product.product_name}`)
                return res.status(403).json({ error: "product not found" })
            }
            else {
                return res.status(200).json({ message: "product deleted successfully" })
            }
        })
        .catch(err => {
            return res.status(400).json({ error: err })
        })
}

// to update product
exports.updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.pid,
        {
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            countInStock: req.body.countInStock,
            productDescription: req.body.productDescription,
            productImage: req.file.path,
            category: req.body.category
        },
        {
            new: true
        }
    )
    if (!product) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    res.send(product)
}
