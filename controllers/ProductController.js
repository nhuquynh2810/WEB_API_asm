const { isValidObjectId } = require('mongoose');
const ProductModel = require('./ProductModel');
const CategoryModel = require('./CategoryModel');
const CartModel = require('./CartModel');
const { Types } = require('mongoose');
//________________________________________APP_______________________________________

//Lấy sản phẩm theo id (DETAIL)
const getProductById_App = async (id) => {
    try {
        // tìm sản phẩm theo id
        const productInDB = await ProductModel.findById(id);
        if (!productInDB) {
            throw new Error('Sản phẩm không tồn tại');
        }
        return productInDB;
    } catch (error) {
        console.log('findProduct error: ', error.message);
        throw new Error('Tìm kiếm sản phẩm không thành công');
    }
}

//Lấy danh sách sản phẩm (HOME)
const getProduct_App = async () => {
    try {
        let query = {};
        query = {
            ...query,
        }
        const products = await ProductModel
            .find(query)
        return products;
    } catch (error) {
        console.log('getProducts error: ', error.message);
        throw new Error('Lấy danh sách sản phẩm lỗi');
    }
}
// Tìm kiến sản phẩm theo từ khóa (SEARCH)
const findProductsByKey_App = async (key) => {
    try {
        // câu điều kiện
        let query = {};
        // where .....
        query = {
            ...query,
            name: { $regex: key, $options: 'i' } //bỏ viết hoa và viết thường
        }
        const products = await ProductModel
            .find(query)
        return products;
    } catch (error) {
        console.log('getProducts error: ', error.message);
        throw new Error('Lấy danh sách sản phẩm lỗi');
    }
}
//________________________________________APP_______________________________________

//lấy danh sách sản phẩm có sắp xếp/phân trang
const getProducts = async (limit, page) => {
    try {
        limit = parseInt(limit) || 20;
        page = parseInt(page) || 1;
        const skip = (page - 1) * limit;
        let query = {};

        const products = await ProductModel.find({})
            .limit(limit)
            .skip(skip)
        // .sort({price: -1});
        return products;

    } catch (error) {
        console.log('getProduct error: ', error.message);
        throw new Error('Lấy danh sách sản phẩm lỗi');
    }
}
// tìm kiếm sản phẩm theo từ khóa
const findProducts = async (key) => {
    try {
        let query = {};

        query = {
            ...query,
            name: { $regex: key, $options: 'i' }
        }

        const products = await ProductModel
            .find(query)
        // .sort({ name: -1 });
        return products;

    } catch (error) {
        console.log('findProduct error: ', error.message);
        throw new Error('Tìm kiếm sản phẩm không thành công');
    }
}
// tìm kiếm sản phẩm theo id
const getProductById = async (id) => {
    try {
        // tìm sản phẩm theo id
        const productInDB = await ProductModel.findById(id);
        if (!productInDB) {
            throw new Error('Sản phẩm không tồn tại');
        }
        return productInDB;
    } catch (error) {
        console.log('findProduct error: ', error.message);
        throw new Error('Tìm kiếm sản phẩm không thành công');
    }
}
// lọc kiếm sản phẩm theo giá
const filterProducts = async (min, max) => {
    try {
        let query = {};

        query = {
            ...query,
            $and: [{ price: { $gte: min } }, { price: { $lte: max } }, { quantity: { $gt: 0 } }],

        }
        const products = await ProductModel
            .find(query);
        // .sort({ name: -1 });
        return products;

    } catch (error) {
        console.log('filterProduct error: ', error.message);
        throw new Error('Tìm kiếm sản phẩm không thành công');
    }
}

//lấy danh sách sản phẩm theo danh mục
const getProductsByCategory = async (id) => {
    try {
        console.log('---------------id: ', id);
        let query = {};
        query = {
            ...query,
            'category.category_id': new Types.ObjectId(id)
        };
        console.log(query);
        const products = await ProductModel.find(query);
        return products;
    } catch (error) {
        console.log('findProduct error: ', error.message);
        throw new Error('Tìm kiếm sản phẩm không thành công');
    }
}

// xóa sản phẩm theo id
const deleteProduct = async (id) => {
    try {
        // tìm sản phẩm theo id
        const productInDB = await ProductModel.findById(id);
        if (!productInDB) {
            throw new Error('Sản phẩm không tồn tại');
        }
        // xóa sản phẩm
        await ProductModel.deleteOne({ _id: id });
        return true;
    } catch (error) {
        console.log('deleteProduct error: ', error.message);
        throw new Error('Xóa sản phẩm lỗi');
    }
}

//cập nhật sản phẩm
const updateProduct = async (id, name, price, quantity,
    images, description, category) => {
    try {
        //tìm sản phẩm theo id
        console.log(id)
        const productInDB = await ProductModel.findById(id);
        if (!productInDB) {
            throw new Error('Sản phẩm không tồn tại');
        }
        if (!category) {
            throw new Error('Danh mục không tồn tại');
        }
        //lấy category theo id
        const categoryInDB = await CategoryModel.findById(category);
        if (!categoryInDB) {
            throw new Error('Danh mục không tồn tại');
        }
        //tạo object category
        category = {
            category_id: categoryInDB._id,
            category_name: categoryInDB.name
        }

        //cập nhập sản phẩm
        productInDB.name = name || productInDB.name;
        productInDB.price = price || productInDB.price;
        productInDB.quantity = quantity || productInDB.quantity;
        productInDB.images = images || productInDB.images;
        productInDB.description = description || productInDB.description;
        productInDB.category = category || productInDB.category;
        productInDB.updatedAt = Date.now();

        //update prodcuts set name = name, price = price, quantity = quantity,
        //images = images, description = description, category = category where id = id
        await productInDB.save();
        return true;
    } catch (error) {
        console.log('updateProduct error: ', error.message);
        throw new Error('Cập nhập sản phẩm lỗi');
    }
}

//thêm sản phẩm
const addProduct = async (name, price, quantity, images, description, category) => {
    try {
        //lấy category theo id 
        console.log('id', category);
        const categoryInDB = await CategoryModel.findById(category);
        if (!categoryInDB) {
            throw new Error('Danh mục không tồn tại');
        }
        //tạo object category
        category = {
            category_id: categoryInDB._id,
            category_name: categoryInDB.name
        }
        console.log(category);
        const product = {
            name, price, quantity, images, description, category
        }
        const newProduct = new ProductModel(product);
        const result = await newProduct.save();
        return result;
    } catch (error) {
        console.log('addProduct error: ', error.message);
    }
}


//thống kê top 10 sp có số lượng nhiều nhất trong kho
const getTopProduct = async () => {
    try {
        let query = {};
        const products = await ProductModel
            .find(query, 'name price quantity')
            .sort({ quantity: -1 })
            .limit(10);
        return products;
    } catch (error) {
        console.log('Thống kê sản phẩm lỗi');
        throw new Error('Thống kê sản phẩm lỗi');
    }
}

const thongKeTopSanPhamBanChayNhat = async () => {
    try {
        const pipeline = [
            // Bước 1: "Unwind" từng sản phẩm trong mảng sản phẩm của đơn hàng
            { $unwind: "$products" }, //tách từng sp trong mỗi cart ra bảng riêng
            // Bước 2: Nhóm các sản phẩm theo id và tính tổng số lượng đã bán
            {
                $group: {//theo mình thấy thì bước này giống như tạo 1 sp mới
                    _id: "$products._id",
                    name: { $first: "$products.name" },
                    price: { $first: "$products.price" },
                    tongSoLuongDaBan: { $sum: "$products.quantity" }
                }
            },
            // Bước 3: Sắp xếp theo tổng số lượng đã bán giảm dần
            { $sort: { tongSoLuongDaBan: -1 } },
            // Bước 4: Giới hạn chỉ lấy 10 sản phẩm đầu tiên
            { $limit: 10 }
        ];

        const topSanPhamBanChayNhat = await CartModel.aggregate(pipeline);

        return topSanPhamBanChayNhat;
    } catch (error) {
        console.log('Lỗi khi thống kê sản phẩm bán chạy nhất:', error);
        throw new Error('Lỗi khi thống kê sản phẩm bán chạy nhất');
    }
}

// const thongKeSanPhamTheoThang = async () => {
//     try {
//         const pipeline = [
//             // Bước 1: Tạo trường mới "month" là số tháng từ tháng đầu tiên trong năm
//             {
//                 $addFields: {
//                     month: { $month: { date: "$date", timezone: "+00:00" } }
//                 }
//             },
//             // Bước 2: "Unwind" từng sản phẩm trong mảng sản phẩm của đơn hàng
//             { $unwind: "$products" },
//             // Bước 3: Nhóm các đơn hàng theo tháng và sản phẩm, tính tổng số lượng đã bán
//             {
//                 $group: {
//                     _id: { month: "$month", productId: "$products._id" },
//                     tongSoLuongDaBan: { $sum: "$products.quantity" }
//                 }
//             },
//             // Bước 4: Group lại theo tháng và tính tổng số lượng sản phẩm đã bán trong mỗi tháng
//             {
//                 $group: {
//                     _id: "$_id.month",
//                     tongSoLuongSanPham: { $sum: "$tongSoLuongDaBan" }
//                 }
//             },
//             // Bước 5: Sắp xếp theo tháng tăng dần
//             { $sort: { "_id": 1 } }
//         ];

//         const thongKeSanPham = await DonHangModel.aggregate(pipeline);

//         return thongKeSanPham;
//     } catch (error) {
//         console.log('Lỗi khi thống kê số lượng sản phẩm theo tháng:', error);
//         throw new Error('Lỗi khi thống kê số lượng sản phẩm theo tháng');
//     }
// }



module.exports = {
    getProducts,
    findProducts,
    filterProducts,
    getProductsByCategory,
    deleteProduct,
    updateProduct,
    addProduct,
    getProductById,
    getTopProduct,
    thongKeTopSanPhamBanChayNhat,

    getProductById_App,
    findProductsByKey_App,
    getProduct_App
}