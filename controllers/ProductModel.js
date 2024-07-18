// khai báo 1 schema(model) cho product
// (_id, name, price, quantity, createAt, updateAt)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductSchema = new Schema({
    name: {type: String, require: true},
    price: {type: Number, require: true, default: 0},
    quantity: {type: Number, default: 0},
    images: {type: Array, default: []},
    description: {type: String, default: ''},
    category: {type: Object, default: {}},
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now},
    
})

//tiếng anh, số ít, chữ thường, không dấu, không cách
module.exports = mongoose.models.product || mongoose.model('product', ProductSchema);


