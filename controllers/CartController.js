const CartModel = require('./CartModel');
const UserModel = require('./UserModel');
const ProductModel = require('./ProductModel');
const ObjectId = require('mongoose').Types.ObjectId;
const AppConstants = require('../helpers/AppConstants');
//________________________________________APP_______________________________________

//thêm cart
const addCart_App = async (user, products) => {
    try {
        // user: user id của người mua
        // products: mảng id của sản phẩm và số lượng mua
        const userInDB = await UserModel.findById(user);
        if (!userInDB) {
            throw new Error('User not found');
        }
        console.log('user', user);
        // kiểm tra products có phải là mảng hay không
        console.log('Products', products);
        if (!Array.isArray(products)) {
            throw new Error('Products must be an array');
        }
        let productsInCart = [];
        let total = 0;
        for (let index = 0; index < products.length; index++) {//thầy dùng mảng để chắc chắn tất cả các sp đều được duyệt qua
            const item = products[index];
            const product = await ProductModel.findById(item._id);
            if (!product) {
                throw new Error('Product not found');
            }
            // nếu số lượng lớn hơn số lượng tồn kho
            if (item.quantity > product.quantity) {
                throw new Error('Product out of stock');
            }
            const productItem = {
                _id: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            };
            productsInCart.push(productItem);
            total += product.price * item.quantity;
        }
        // tạo giỏ hàng mới
        const cart = new CartModel({
            user: { _id: userInDB._id, name: userInDB.name },
            products: productsInCart,
            total,
        });
        const result = await cart.save();


        setTimeout(async () => {
            // chạy ngầm cập nhật số lượng tồn kho của sản phẩm
            for (let index = 0; index < products.length; index++) {
                const item = products[index];
                const product = await ProductModel.findById(item._id);
                product.quantity -= item.quantity;
                await product.save();
            }
            // cập nhật lịch sử mua hàng của người dùng

            //....sửa lại để đáp ứng giao diện history
            for (let index = 0; index < products.length; index++) {
                const item = products[index];
                const product = await ProductModel.findById(item._id);
                let newItem = {
                    _id: item._id,
                    name: product.name,
                    quantity: item.quantity,
                    status: result.status,
                    images: product.images,
                    date: Date.now()
                }
                userInDB.carts.push(newItem);
            }
            // let item = {
            //     _id: result._id,
            //     date: result.date,
            //     total: result.total,
            //     status: result.status,
            //     //....Thêm 2 thuộc tính để hiển thị lấy cart từ user hiển thị lên history
            //     quantity: result.quantity,
            //     name: result.name
            // };
            // userInDB.carts.push(item);
            await userInDB.save();
        }, 0);


        return result;
    } catch (error) {
        console.log(error);
        throw new Error('Add to cart failed');
    }
}


//________________________________________APP_______________________________________




//thêm cart
const add = async (user, products) => {
    try {
        // user: user id của người mua
        // products: mảng id của sản phẩm và số lượng mua
        const userInDB = await UserModel.findById(user);
        if (!userInDB) {
            throw new Error('User not found');
        }
        // kiểm tra products có phải là mảng hay không
        if (!Array.isArray(products)) {
            throw new Error('Products must be an array');
        }
        let productsInCart = [];
        let total = 0;
        for (let index = 0; index < products.length; index++) {//thầy dùng mảng để chắc chắn tất cả các sp đều được duyệt qua
            const item = products[index];
            const product = await ProductModel.findById(item._id);
            if (!product) {
                throw new Error('Product not found');
            }
            // nếu số lượng lớn hơn số lượng tồn kho
            if (item.quantity > product.quantity) {
                throw new Error('Product out of stock');
            }
            const productItem = {
                _id: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            };
            productsInCart.push(productItem);
            total += product.price * item.quantity;
        }
        // tạo giỏ hàng mới
        const cart = new CartModel({
            user: { _id: userInDB._id, name: userInDB.name },
            products: productsInCart,
            total,
        });
        const result = await cart.save();


        setTimeout(async () => {
            // chạy ngầm cập nhật số lượng tồn kho của sản phẩm
            for (let index = 0; index < products.length; index++) {
                const item = products[index];
                const product = await ProductModel.findById(item._id);
                product.quantity -= item.quantity;
                await product.save();
            }
            // cập nhật lịch sử mua hàng của người dùng
            // let item = {
            //     _id: result._id,
            //     date: result.date,
            //     total: result.total,
            //     status: result.status,
            // };
            // userInDB.carts.push(item);

            for (let index = 0; index < products.length; index++) {
                const item = products[index];
                const product = await ProductModel.findById(item._id);
                let newItem = {
                    _id: item._id,
                    name: product.name,
                    quantity: item.quantity,
                    status: result.status,
                    images: product.images,
                    date: Date.now()
                }
                userInDB.carts.push(newItem);
            }
            await userInDB.save();
        }, 0);


        return result;
    } catch (error) {
        console.log(error);
        throw new Error('Add to cart failed');
    }
}

// lấy toàn bộ đơn hàng của hệ thống, có săp xếp theo ngày giờ mua
// lấy toàn bộ đơn hàng theo trạng thái, có sắp xếp theo ngày giờ mua
// lấy toàn bộ đơn hàng của 1 người dùng, có sắp xếp theo ngày giờ mua
const getCarts = async (status, user) => {
    try {
        let query = {};
        if (status) {
            query.status = status;
        }
        if (user) {
            query = {
                ...query,
                'user._id': new ObjectId(user),
            };
        }
        console.log(query);
        const carts = await CartModel
            .find(query)
            .sort({ date: -1 });//sắp xếp ngày tháng giảm dần
        return carts;
    } catch (error) {
        console.log(error);
        throw new Error('Get carts failed');
    }
}

// cập nhật trạng thái đơn hàng
const updateCarts = async (id, status) => {
    try {
        const cart = await CartModel.findById(id);
        if (!cart) {
            throw new Error('Cart not found');
        }
        if (status < cart.status ||
            (status == AppConstants.CART_STATUS.HOAN_THANH &&
                cart.status == AppConstants.CART_STATUS.XAC_NHAN) ||
            status > 4) {
            throw new Error('Can not update to higher status');
        }
        cart.status = status;
        let result = await cart.save();
        //cập nhật trạng thái đơn hàng ở user
        // setTimeout( async () => {
        //     const user = await UserModel.findById(cart.user._id)
        // }, 0);
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('Update cart failed');
    }
}



module.exports = {
    add,
    getCarts,
    updateCarts,

    addCart_App
}