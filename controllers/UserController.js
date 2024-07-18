const { model } = require('mongoose');
const userModel = require('./UserModel');
const bcrypt = require('bcryptjs');
const { sendMail } = require('../helpers/Mailer');
const html = require('../helpers/MailContent');
const UserModel = require('./UserModel');

//________________________________________APP_______________________________________

//Lấy thông tin tài khoảng bằng id (Lấy dữ liệu mới nhất về cho HISTORY (cart của user), CHANGINFO(thông tin user))
const getUser_App = async (_id) => {
    try {
        //kiểm tra email, password có rỗng không
        if (_id == '' || _id == undefined) {
            throw new Error('_Id không hợp lệ')
        }
        //kiểm tra user có tồn tại theo id không
        const user = await userModel.findOne({ _id: _id });
        if (!user) {
            throw new Error('Email không tồn tại')
        } else {
            console.log('Lấy thông tin thành công:', user);
            return user
        }
        return null;
    } catch (error) {
        console.log('Error:', error.message);
        throw new Error('Đăng nhập thất bại');
    }
}

//đăng ký 
const register_App = async (email, name, password) => {
    try {
        //check email exists in db - select * from users where email = email
        let user = await userModel.findOne({ email: email });//phải sử dụng let
        if (user) {
            throw new Error('Email đã tồn tại');
        }

        //kiểm tra bỏ trống
        if (email == '' || email == undefined || name == '' || name == undefined || password == '' || password == undefined) {
            throw new Error('Email hoặc password hoặc name không hợp lệ!')
        }

        //kiểm tra định dạng email, password
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;

        if (!emailRegex.test(email)) {
            throw new Error('Email không đúng định dạng')
        }
        if (!passwordRegex.test(password)) {
            throw new Error('Password không đúng định dạng')
        }

        //mã hóa password
        //mã hóa password có nghĩa khi người dùng nhập vào 1 chuỗi,
        //thì nó sẽ trả ra 1 đoạn mã khác 
        //ví dụ : password là 1 sẽ đc trả ra 1 chuỗi s8u87y6ttftfy76ty6ty78u8
        //người khác cũng nhập là 1 đối vs tài khoản khác thì chuỗi mã hóa cũng sẽ khác,
        //không giống chuỗi trước
        const salt = bcrypt.genSaltSync(10);//thầy bảo doc nói nên để là 10, không nên để quá lớn
        password = bcrypt.hashSync(password, salt);
        //tạo mã code
        var code = Math.floor(Math.random() * 100000);
        //create new user
        user = new userModel({
            email: email,
            password: password,
            name: name,
            code: code,
            address: '',
            phoneNumber: ''
        });
        //save user
        const result = await user.save();
        //gửi email xác thực tài khoản
        setTimeout(async () => {
            const data = {
                email: email,
                subject: `Xác thực tài khoản ${email}`,
                content: html.html(name, code)
            }
            await sendMail(data);
        }, 0);
        return result;
    } catch (error) {
        console.log('Register error: ', error.message);;
        throw new Error('Đăng kí thất bại')
    }
}

//đăng nhập
const login_App = async (email, password) => {
    try {
        //kiểm tra email, password có rỗng không
        if (email == '' || email == undefined || password == '' || password == undefined) {
            throw new Error('Email hoặc password không hợp lệ')
        }
        //kiểm tra email tồn tại không
        //lấy user trong db theo email
        const user = await userModel.findOne({ email: email });
        if (!user) {
            throw new Error('Email không tồn tại')
        } else {
            //kiểm tra password trong database đã mã hóa, với mật khẩu người dùng nhập chưa mã hóa
            const check = bcrypt.compareSync(password, user.password);
            if (check) {
                //xóa field password trước khi trả về
                delete user._doc.password;
                console.log('Đăng nhập thành công:', user);
                return user //hoặc trả về 1 object mới ở đây
            } else {
                throw new Error('Mật khẩu không chính xác')
            }
        }
        return null;
    } catch (error) {
        console.log('Error:', error.message);
        throw new Error('Đăng nhập thất bại');
    }
}

//cập nhật tài khoản
const updateUser_App = async (id, name, address, phoneNumber, avatar) => {
    try {
        //kiểm tra id, name, password, phoneNumber, address rỗng
        if (id == '' || id == undefined || name == '' || name == undefined || phoneNumber == undefined || address == undefined || avatar == '') {
            throw new Error('Name hoặc password hoặc id hoặc address hoặc phoneNumber hoặc avatar không hợp lệ')
        }

        //tìm user theo id
        const userInDB = await UserModel.findById(id);
        if (!userInDB) {
            throw new Error('Tài khoản không tồn tại');
        }

        //kiểm tra password có đúng định dạng
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
        const phoneNumberRegex = /^\d{10,}$/;

        // if (!passwordRegex.test(password)) {
        //     throw new Error('Password không đúng định dạng')
        // }
        if (!phoneNumberRegex.test(phoneNumber)) {
            throw new Error('Số điện thoại không đúng định dạng')
        }

        //buộc phải mã hóa password ở update để không bị xung đột dữ liệu với register 
        // const salt = bcrypt.genSaltSync(10);
        // password = bcrypt.hashSync(password, salt);

        //cập nhập tài khoản
        userInDB.name = name || userInDB.name;
        // userInDB.password = password || userInDB.password;
        userInDB.phoneNumber = phoneNumber || userInDB.phoneNumber;
        userInDB.address = address || userInDB.address;
        userInDB.avatar = avatar || userInDB.avatar;
        userInDB.updatedAt = Date.now();

        await userInDB.save();
        return userInDB;
    } catch (error) {
        console.log('Update Error: ', error.message);
        throw new Error('Cập nhập tài khoản thất bại');
    }
}




//________________________________________APP_______________________________________

//register a new user
const register = async (email, name, password) => {
    try {
        //check email exists in db - select * from users where email = email
        let user = await userModel.findOne({ email: email });//phải sử dụng let
        if (user) {
            throw new Error('Email đã tồn tại');
        }
        //mã hóa password
        //mã hóa password có nghĩa khi người dùng nhập vào 1 chuỗi,
        //thì nó sẽ trả ra 1 đoạn mã khác 
        //ví dụ : password là 1 sẽ đc trả ra 1 chuỗi s8u87y6ttftfy76ty6ty78u8
        //người khác cũng nhập là 1 đối vs tài khoản khác thì chuỗi mã hóa cũng sẽ khác,
        //không giống chuỗi trước
        const salt = bcrypt.genSaltSync(10);//thầy bảo doc nói nên để là 10, không nên để quá lớn
        password = bcrypt.hashSync(password, salt);
        //tạo mã code
        const code = Math.floor(Math.random() * 1000);
        //create new user
        user = new userModel({
            email: email,
            password: password,
            name: name,
            code: code
        });
        //save user
        const result = await user.save();

        //gửi email xác thực tài khoản
        setTimeout(async () => {
            const data = {
                email: email,
                subject: `Xác thực tài khoản ${email}`,
                content: html.html(name, code)
            }
            await sendMail(data);
        }, 0);
        return result;
    } catch (error) {
        console.log('Register error: ', error.message);;
        throw new Error('Đăng kí thất bại')
    }
}

//login
const login = async (email, password) => {
    try {
        //lấy user trong db theo email
        const user = await userModel.findOne({ email: email });
        console.log("------------------------email:", user);
        if (!user) {
            throw new Error('Email không tồn tại')
        } else {
            //kiểm tra password
            // const check = user.password.toString() === password.toString();
            const check = bcrypt.compareSync(password, user.password);
            if (check) {
                //xóa field password trước khi trả về
                delete user._doc.password;
                console.log('Đăng nhập thành công:', user);
                return user //hoặc trả về 1 object mới ở đây
            }
        }
        return null;

    } catch (error) {
        console.log('Đăng nhập thất bại: ', error.message);
        throw new Error('Đăng nhập thất bại');
    }
}

//cập nhật tài khoản
const updateUser = async (id, name, password) => {
    try {
        //tìm user theo id
        const userInDB = await UserModel.findById(id);
        if (!userInDB) {
            throw new Error('User không tồn tại');
        }

        //buộc phải mã hóa password ở update để không bị xung đột dữ liệu với register 
        const salt = bcrypt.genSaltSync(10);//thầy bảo doc nói nên để là 10, không nên để quá lớn
        password = bcrypt.hashSync(password, salt);

        //cập nhập sản phẩm
        userInDB.name = name || userInDB.name;
        userInDB.password = password || userInDB.password;
        userInDB.updatedAt = Date.now();

        //update prodcuts set name = name, price = price, quantity = quantity,
        //images = images, description = description, category = category where id = id
        await userInDB.save();
        return true;
    } catch (error) {
        console.log('updateUser error: ', error.message);
        throw new Error('Cập nhập User lỗi');
    }
}

//xác thực tài khoản
const verifyAccout = async (email, code) => {
    code = Number(code)
    try {
        //lấy user trong db theo email
        const user = await userModel.findOne({ email: email });
        if (!user) {
            throw new Error('Email không tồn tại')
        } else {
            //kiểm code
            // const check = user.password.toString() === password.toString();
            const check = user.code === code;
            if (check) {
                user.isVerified = 2;
                await user.save(); // Lưu thay đổi vào cơ sở dữ liệu
                console.log('Xác thực thành công');
                return 'Xác thực thành công' //hoặc trả về 1 object mới ở đây
            }
        }
        return null;

    } catch (error) {
        console.log('Xác thực thất bại: ', error.message);
        throw new Error('Xác thực thất bại');
    }
}

module.exports = {
    register,
    login,
    updateUser,
    verifyAccout,

    updateUser_App,
    login_App,
    register_App,
    getUser_App
}