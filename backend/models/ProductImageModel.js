const mongoose = require('mongoose');

const ProductModelSchema = mongoose.Schema({
    image: { type: String, required: false, default: "" },
})

const ProductModel = mongoose.model("product_images", ProductModelSchema);

module.exports = ProductModel;