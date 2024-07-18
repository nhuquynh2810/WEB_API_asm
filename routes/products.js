var express = require('express');
var router = express.Router();
//http://localhost:7777/products
const ProductController = require('../controllers/ProductController');
const validation = require('../middlewares/Validation');

//________________________________________APP_______________________________________
// 1. API Lấy danh sách tất cả sản phẩm (HOME)
// method: get
// url: http://localhost:7777/products/getProducts_App
// kết quả: danh sách sản phẩm có sắp xếp giảm dần theo giá tiền
router.get('/getProducts_App', async (req, res) => {
    try {
        const products = await ProductController.getProduct_App();
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message });
    }
});

// 2. API tìm kiếm sản phẩm theo từ khóa (SEARCH)
// method: get
// url: http://localhost:7777/products/findProductsByKey_App?key=Product 1
// kết quả: danh sách sản phẩm có tên hoặc mô tả chứa từ khóa tìm kiếm
router.get('/findProductsByKey_App', async (req, res) => {
    try {
        const { key } = req.query;
        if (key == '' || key == undefined) {
            throw new Error('Từ khóa tìm kiếm không hợp lệ!')
        }
        const products = await ProductController.findProductsByKey_App(key)

        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message });
    }
});

/**
 * method: lấy sản phẩn theo Id (DETAIL)
 * url: http://localhost:7777/products/getProductById_App/:id=1
 * response: trả về sản phẩm có chứa từ id tìm kiếm
 */
router.get('/getProductById_App/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id);
        const products = await ProductController.getProductById_App(id);
        console.log(products);
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        console.log('Tìm kiếm sản phẩm thất bại');
        return res.status(500).json({ status: false, data: error.message });
    }
})
//________________________________________APP_______________________________________


/**
 * method: get
 * url: http://localhost:7777/products?limit=10&page=1
 * response: trả về danh sách sản phẩm
 */
router.get('/', async (req, res, next) => { //tại sao ko validate được, ở thunder chạy oke, ở web thì không
    try {
        const { limit, page } = req.query;
        const products = await ProductController.getProducts(limit, page);
        return res.status(200).json({ status: true, data: products })
    } catch (error) {
        console.log('Lấy danh sách sản phẩm thất bại');
        return res.status(500).json({ status: false, data: error.message });
    }
})

/**
 * method: get
 * url: http://localhost:7777/products/search?key=name
 * response: trả về danh sách sản phẩm có chứa từ khóa tìm kiếm
 */
router.get('/search', async (req, res, next) => {
    try {
        const { key } = req.query;
        // console.log('dfshdjbvhd', key);
        const products = await ProductController.findProducts(key);
        console.log(products);
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        console.log('Tìm kiếm sản phẩm thất bại');
        return res.status(500).json({ status: false, data: error.message });
    }
})

/**
 * method: get
 * url: http://localhost:7777/products/searchByID/:id=1
 * response: trả về sản phẩm có chứa từ id tìm kiếm
 */
router.get('/searchByID/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        // console.log('dfshdjbvhd', key);
        const products = await ProductController.getProductById(id);
        console.log(products);
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        console.log('Tìm kiếm sản phẩm thất bại');
        return res.status(500).json({ status: false, data: error.message });
    }
})

/**
 * method: get
 * url:  http://localhost:7777/products/filterByPrice?min=1&max=10
 * response: danh sách sản phẩm theo như yêu cầu, có sắp xếp tăng dần theo số lượng
 */
router.get('/filterByPrice', async (req, res, next) => {
    try {
        let { min, max } = req.query;
        min = parseInt(min);
        max = parseInt(max);
        console.log('min: ', min, 'max: ', max);
        const products = await ProductController.filterProducts(min, max);
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        console.log('Lấy danh sách sản phẩm thất bại');
        return res.status(500).json({ status: false, data: error.message });
    }
})

/**
 * method: get
 * url: http://localhost:7777/products/category?id=1
 * response: danh sách sản phẩm theo danh mục
 */
router.get('/category', async (req, res, next) => {
    try {
        const { id } = req.query;
        console.log('..............id: ', id);
        const products = await ProductController.getProductsByCategory(id);
        console.log('..............product: ', products);
        return res.status(200).json({ status: true, data: products })
    } catch (error) {
        console.log('Lấy danh sách sản phẩm thất bại');
        return res.status(500).json({ status: false, data: error.message });
    }
})

/**
 * method: post
 * url: http://localhost:7777/products/:id/delete
 * response: trả về sản phẩm vừa xóa
 */
router.post('/:id/delete', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await ProductController.deleteProduct(id);
        return res.status(200).json({ status: true, data: product });
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message });
    }
})

/**
 * Cập nhập cũng có thể sử dụng post
 * method: post
   url: http://localhost:7777/products/:id/update
 * body: name, price, quantity, images, description, category
 * response: trả về sản phẩm vừa cập nhập
 */
router.post('/:id/update', [validation.validateProduct], async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, price, quantity, images, description, category } = req.body;
        console.log('---------->' + req.body + "   " + category)
        const product = await ProductController.updateProduct(id, name, price, quantity, images, description, category);
        return res.status(200).json({ status: true, data: product });
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message });
    }
})

/**
 * method: post
 * url: http://localhost:7777/products
 * body: name, price, quantity, images, description, category
 * response: trả về sản phẩm vừa tạo
 */
router.post('/', [validation.validateProduct], async (req, res, next) => {
    try {
        const { name, price, quantity, images, description, category } = req.body;
        const product = await ProductController.addProduct(name, price, quantity, images, description, category);
        return res.status(200).json({ status: true, data: product });
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message });
    }
})

/**
 * Thống kê
 * method: get
 * url:  http://localhost:7777/products/statistics
 */
router.get('/statistics', async (req, res, next) => {
    try {
        const products = await ProductController.getTopProduct();
        return res.status(200).json({ status: true, data: products })
    } catch (error) {
        console.log('Thống kê sản phẩm lỗi');
        return res.status(500).json({ status: false, data: error.message });
    }
})


/**
 * Thống kê
 * method: get
 * url:  http://localhost:7777/products/statisticsByTotal
 */
router.get('/statisticsByTotal', async (req, res, next) => {
    try {
        const products = await ProductController.thongKeTopSanPhamBanChayNhat();
        return res.status(200).json({ status: true, data: products })
    } catch (error) {
        console.log('Thống kê sản phẩm lỗi');
        return res.status(500).json({ status: false, data: error.message });
    }
})


module.exports = router;
