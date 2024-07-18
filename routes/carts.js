var express = require('express');
var router = express.Router();
//http://localhost:7777/carts
const CartController = require('../controllers/CartController');

//________________________________________APP_______________________________________
/**
 * thêm giỏ hàng mới
 * method: POST
 * body: {user, product}
 * url: http://localhost:7777/carts
 * return: {_id, user, products, total, status, date}
 */
router.post('/addCart_App', async (req, res, next) => {
    try {
        const { user, products } = req.body;
        const result = await CartController.addCart_App(user, products);
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: false, data: error.message });
    }
})
//________________________________________APP_______________________________________

/**
 * thêm giỏ hàng mới
 * method: POST
 * body: {user, product}
 * url: http://localhost:7777/carts
 * return: {_id, user, products, total, status, date}
 */
router.post('/', async (req, res, next) => {
    try {
        const { user, products } = req.body;
        const result = await CartController.add(user, products);
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: false, data: error.message });
    }
});

/**
 * Lấy toàn bộ đơn hàng của hệ thống, có sắp xếp theo ngày giờ mua hàng
 * method: get
 * url: http://localhost:7777/carts?status=1?user=1
 * return: [{_id, user, products, total, status, date}]
 */
router.get('/', async (req, res, next) => {
    try {
        const { status, user } = req.query;
        const result = await CartController.getCarts(status, user);
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log("Lấy danh sách cart lỗi: ", error.message);
        return res.status(500).json({ status: false, data: error.message });
    }
});

/**
 * Cập nhật trạng thái mua hàng
 * method: POST
 * body: {user, product}
 * url: http://localhost:7777/carts/:id/update
 * return: {_id, user, products, total, status, date}
 */
router.post('/:id/update', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await CartController.updateCarts(id, status);
        console.log('result: ------------------------', result);
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: false, data: error.message });
    }
});

module.exports = router;