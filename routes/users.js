var express = require('express');
var router = express.Router();
const userController = require('../controllers/UserController');
const validation = require('../middlewares/Validation');
//http://localhost:7777/users

//________________________________________APP_______________________________________
/**
 * getUser
  * method: get
 * url: //http://localhost:7777/users/getUser_App
 * body: {"_id": "660901881055980a62507d58"}
 * respond trả về thông tin user nếu tìm thành công,
 * trả về lỗi nếu tìm thất bại
 */
router.post('/getUser_App', async (req, res, next) => {
    try {
        const { _id } = req.body;
        console.log('id user', _id);
        const result = await userController.getUser_App(_id);
        if (!result) {
            throw new Error('Lấy thông tin thất bại')
        }
        res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log('Get user error: ', error.message);
        res.status(500).json({ status: false, data: error.message });
    }
});

/**
 * register
 * method: post
 * url: //http://localhost:7777/users/register_App
 * body:{ email: 'admin@gmail', password: '1', name: 'admin'}
 * respond: trả về thông tin user nếu đăng kí thành công
 * trả về lỗi nếu đăng kí thất bại
 */
router.post('/register_App', async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const result = await userController.register_App(email, name, password);
        if (!result) {
            throw new Error('Đăng ký thất bại');
        }
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log('Register error: ', error.message);
        res.status(500).json({ status: true, data: 'Đăng ký thất bại' });
    }
});

/**
 * login
  * method: post
 * url: //http://localhost:7777/users/login_App
 * body: {email: 'dfsf@gmail', password: '1'}
 * respond trả về thông tin user nếu đăng nhập thành công,
 * trả về lỗi nếu đăng nhập thất bại
 */
router.post('/login_App', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!result) {
            throw new Error('Đăng nhập thất bại')
        }
        res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log('Login error: ', error.message);
        res.status(500).json({ status: false, data: error.message });
    }
});

/**
 * update
 * method: post
 * url: http://localhost:7777/users/:id/updateUser_App
 * body; {name: 'sfs', password: 'sfsdfds'}
 * response: thông tin user mới,
 * trả về lỗi nếu thất bại
 */
router.post('/:id/updateUser_App', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, phoneNumber, address, avatar } = req.body;
        console.log(req.body)
        const user = await userController.updateUser_App(id, name, address, phoneNumber, avatar);
        if (!user) {
            throw new Error('Cập nhập thất bại')
        }
        return res.status(200).json({ status: true, data: user });
    } catch (error) {
        console.log('Cập nhật tài khoản thất bại');
        return res.status(500).json({ status: false, data: error.message });
    }
})
//________________________________________APP_______________________________________


/**
 * register
 * method: post
 * url: //http://localhost:7777/users/register
 * body:{ email: 'admin@gmail', password: '1', name: 'admin'}
 * respond: trả về thông tin user nếu đăng kí thành công
 * trả về lỗi nếu đăng kí thất bại
 */
router.post('/register',
    [validation.validateUserName,
    validation.validateEmail,
    validation.validatePassword], async (req, res, next) => {
        try {
            const { email, password, name } = req.body;
            const result = await userController.register(email, name, password);
            res.status(200).json(result);
        } catch (error) {
            console.log('Register error: ', error.message);
            res.status(500).json({ message: error.message });
        }
    });

/**
 * login
  * method: post
 * url: //http://localhost:7777/users/login
 * body: {email: 'dfsf@gmail', password: '1'}
 * respond trả về thông tin user nếu đăng nhập thành công,
 * trả về lỗi nếu đăng nhập thất bại
 */
router.post('/login', [validation.validateEmail, validation.validatePassword], async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await userController.login(email, password);
        if (!result) {
            throw new Error('Không tìm thấy email')
        }
        res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log('Login error: ', error.message);
        res.status(500).json({ status: false, data: error.message });
    }
});

/**
 * update
 * method: post
 * url: http://localhost:7777/users/:id/update
 * body; {name: 'sfs', password: 'sfsdfds'}
 * response: thông tin user mới,
 * trả về lỗi nếu thất bại
 */
router.post('/:id/update',  async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log('----------------------------id: ', id);
        const { name, password } = req.body;
        console.log('----------------------------id: ', name, password);

        const user = await userController.updateUser(id, name, password);
        return res.status(200).json({ status: true, data: user });
    } catch (error) {
        console.log('Cập nhật tài khoản thất bại');
        return res.status(500).json({ status: false, data: error.message });
    }
})

/**
 * verify
  * method: get
 * url: http://localhost:7777/users/verify?email=abc@gmail&code=123
 * body: {email: 'dfsf@gmail', password: '1'}
 * respond trả về thông tin user nếu đăng nhập thành công,
 * trả về lỗi nếu đăng nhập thất bại
 */
router.get('/verify', async (req, res, next) => {
    try {
        const { email, code } = req.query;
        const result = await userController.verifyAccout(email, code);
        if (!result) {
            throw new Error('Không tìm thấy email')
        }
        res.status(200).json(result);
    } catch (error) {
        console.log('Verify error: ', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

