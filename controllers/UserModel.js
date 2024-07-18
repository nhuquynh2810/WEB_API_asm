// khai báo 1 schema(model) cho users
// (_id, email, name, role, carts, createAt, updateAt)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    name: { type: String, require: true },
    role: { type: Number, default: 1 }, //1: user, 2; admin
    //lịch sử mua hàng
    //{_id, date, total, status}
    carts: { type: Array, default: [] },
    code: { type: Number, default: 0 },
    phoneNumber: { type: String },
    address: { type: String },
    avatar: { type: String, default: 'https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg' },
    //xác thực tài khoản
    //1: chưa xác thực, 2: đã xác thực
    isVerified: { type: Number, default: 1 },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    //tài khoản còn hoạt động không
    available: { type: Boolean, default: true },

    //giỏ hàm tạm
    //cart: {}

})

//tiếng anh, số ít, chữ thường, không dấu, không cách
module.exports = mongoose.models.user || mongoose.model('user', UserSchema);


